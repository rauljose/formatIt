<?php
require __DIR__.'/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Firebase\Auth\Token\Exception\InvalidToken;

$factory = (new Factory)->withServiceAccount('/path/to/your/firebase_credentials.json');
$auth = $factory->createAuth();
$database = $factory->createDatabase();

// Receive the ID token from the client
$input = json_decode(file_get_contents('php://input'), true);
$idToken = $input['idToken'] ?? null;

if (!$idToken) {
    echo json_encode(['success' => false, 'error' => 'No ID token provided']);
    exit;
}

try {
    // Verify the ID token
    $verifiedIdToken = $auth->verifyIdToken($idToken);
    $uid = $verifiedIdToken->claims()->get('sub');

    // Delete user data from your database
    $userRef = $database->getReference('users/' . $uid);
    $userRef->remove();

    // Delete user from Firebase Authentication
    $auth->deleteUser($uid);

    // Delete any other associated data (e.g., from other database tables)
    // ...

    // Destroy the PHP session if you're using one
    session_start();
    session_destroy();

    echo json_encode(['success' => true]);
} catch (InvalidToken $e) {
    echo json_encode(['success' => false, 'error' => 'Invalid token']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
