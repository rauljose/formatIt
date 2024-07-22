<?php
session_start();

// Include Firebase Admin SDK
require __DIR__.'/vendor/autoload.php';

use Firebase\Auth\Token\Exception\InvalidToken;
use Kreait\Firebase\Factory;

$factory = (new Factory)->withServiceAccount('path/to/your/firebase_credentials.json');
$auth = $factory->createAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['idToken'])) {
    $idToken = $_POST['idToken'];

    try {
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        $uid = $verifiedIdToken->claims()->get('sub');

        // Create a session
        $_SESSION['user_id'] = $uid;

        echo json_encode(['success' => true]);
    } catch (InvalidToken $e) {
        echo json_encode(['success' => false, 'error' => 'Invalid token']);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Verification failed']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
