<?php
// tus-php
/** @noinspection PhpMissingParamTypeInspection */
/** @noinspection PhpRedundantOptionalArgumentInspection */

require 'vendor/autoload.php';

use TusPhp\Tus\Server as TusServer;
use TusPhp\Config;

// Create a new TusServer instance
$server = new TusServer();

// Set the upload dir
$server->setUploadDir('/path/to/uploads');

// Handle the request
$response = $server->serve();

// Send the response
$response->send();

// If the route is for creating a new upload or for resuming an existing one
if ('POST' === $server->getRequest()->getMethod() || 'PATCH' === $server->getRequest()->getMethod()) {
    // If the upload was successful, you can retrieve the uploaded file
    $uploadedFile = $server->getUploadedFile();
    $filePath = $uploadedFile->getPathname(); // The path to the uploaded file
}