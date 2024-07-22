<?php
// Verify the token on each request
function verifyIdToken($idToken) {
    $auth = (new Factory)->withServiceAccount('/path/to/serviceAccountKey.json')->createAuth();
    try {
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        return $verifiedIdToken->claims()->get('sub'); // returns the Firebase UID
    } catch (InvalidToken $e) {
        // Token is invalid, expired, etc.
        return false;
    }
}

// Use this function to verify the token on each request
if (isset($_SESSION['id_token'])) {
    $uid = verifyIdToken($_SESSION['id_token']);
    if (!$uid) {
        // Token is invalid or expired
        // Clear the session and redirect to login page
        session_destroy();
        header("Location: login.php");
        exit();
    }
}


/**
 * @param $idToken
 * @return string
 * @throws  InvalidToken 'The token is invalid: ' . $e->getMessage();
 */
function getFirebaseUid($idToken) {
    $factory = (new Factory)->withServiceAccount('/path/to/serviceAccountKey.json');
    $auth = $factory->createAuth();
    $verifiedIdToken = $auth->verifyIdToken($idToken);
    return $verifiedIdToken->claims()->get('sub');
}