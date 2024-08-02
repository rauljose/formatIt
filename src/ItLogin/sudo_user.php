<?php
/**
 * Perform operations on behalf firebase user with his/her token
 * @see token.js
 */
use Kreait\Firebase\Factory;

$factory = (new Factory)->withServiceAccount('/path/to/serviceAccountKey.json');
$auth = $factory->createAuth();
$database = $factory->createDatabase();

// Verify the ID token
$idToken =  $_POST['idToken']; // or json_decode(file_get_contents('php://input');
$verifiedIdToken = $auth->verifyIdToken($idToken);
$uid = $verifiedIdToken->claims()->get('sub');

// Now you can perform operations on behalf of this user
$userRef = $database->getReference('users/' . $uid);
$snapshot = $userRef->getSnapshot();
