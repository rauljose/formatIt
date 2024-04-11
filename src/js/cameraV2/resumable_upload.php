<?php
/** @noinspection PhpMissingParamTypeInspection */
/** @noinspection PhpRedundantOptionalArgumentInspection */
// Resumable.js
// upload_max_filesize, post_max_size, max_file_uploads, and max_execution_time
// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

$tmp_dir = 'tmp/';
$upload_dir = 'uploads/';

// Check if request is GET and the file exists or not
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $temp_dir = $tmp_dir.$_GET['resumableIdentifier'];
    $chunk_file = $temp_dir.'/'.$_GET['resumableFilename'].'.part'.$_GET['resumableChunkNumber'];
    if (file_exists($chunk_file)) {
        header("HTTP/1.0 200 Ok");
    }
    else {
        header("HTTP/1.0 204 No Content");
    }
}
// POST method is used to handle file uploads
else if (!empty($_FILES)) {
    $temp_dir = $tmp_dir.$_POST['resumableIdentifier'];
    $dest_file = $temp_dir.'/'.$_POST['resumableFilename'].'.part'.$_POST['resumableChunkNumber'];

    if (!is_dir($temp_dir)) {
        mkdir($temp_dir, 0777, true);
    }

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $dest_file)) {
        echo("Error moving uploaded file");
    }

    $total_files = 0;
    // Loop through temp directory and count all part files
    foreach(scandir($temp_dir) as $file) {
        if (stripos($file, '.part') !== false) {
            $total_files++;
        }
    }

    // Check if all chunks have been uploaded
    if ($total_files == $_POST['resumableTotalChunks']) {
        // Assemble chunks
        // Open final file in write mode
        if (($fp = fopen($upload_dir.'/'.$_POST['resumableFilename'], 'w')) !== false) {
            for ($i=1; $i<=$total_files; $i++) {
                fwrite($fp, file_get_contents($temp_dir.'/'.$_POST['resumableFilename'].'.part'.$i));
                // Remove chunk
                @unlink($temp_dir.'/'.$_POST['resumableFilename'].'.part'.$i);
            }
            fclose($fp);
        }
        else {
            respondWithError(http_response_code());
        }
        // Remove temporary directory
        @rmdir($temp_dir);
    }
}

function respondWithError($code = 500, $message = 'File upload error.') {
    http_response_code($code);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}
?>