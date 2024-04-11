<?php
/** @noinspection PhpMissingParamTypeInspection */
/** @noinspection PhpRedundantOptionalArgumentInspection */
// Resumable.js
// Directory where we're storing uploaded images
$upload_dir = '/path/to/uploads/';

// Get the file id from the request
$file_id = $_POST['resumableIdentifier'];

// Get the chunk number from the request
$chunk_number = $_POST['resumableChunkNumber'];

// Create a directory for the file
$file_dir = $upload_dir . DIRECTORY_SEPARATOR . $file_id;
if (!file_exists($file_dir)) {
    mkdir($file_dir, 0777, true);
}

// Move the uploaded chunk to the file's directory
$chunk_file = $file_dir . DIRECTORY_SEPARATOR . $chunk_number;
if (!move_uploaded_file($_FILES['file']['tmp_name'], $chunk_file)) {
    // Failed to save the chunk, handle the error
    header("HTTP/1.1 500 Internal Server Error");
    exit();
}

// Check if all chunks have been uploaded
for ($i = 1; $i <= $_POST['resumableTotalChunks']; $i++) {
    if (!file_exists($file_dir . DIRECTORY_SEPARATOR . $i)) {
        // Not all chunks have been uploaded yet
        exit();
    }
}

// All chunks have been uploaded, reassemble the file
$out_file = $upload_dir . DIRECTORY_SEPARATOR . $_POST['resumableFilename'];
if (($fp = fopen($out_file, 'w')) !== false) {
    for ($i = 1; $i <= $_POST['resumableTotalChunks']; $i++) {
        fwrite($fp, file_get_contents($file_dir . DIRECTORY_SEPARATOR . $i));
        unlink($file_dir . DIRECTORY_SEPARATOR . $i);
    }
    fclose($fp);
} else {
    // Failed to open the file for writing, handle the error
    header("HTTP/1.1 500 Internal Server Error");
    exit();
}

// Delete the directory for the file
rmdir($file_dir);