<?php
session_start();

// Check if the user is already logged in
if (isset($_SESSION['user_id'])) {
    // User is logged in, redirect to the dashboard or home page
    header("Location: dashboard.php");
    exit();
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In with Google</title>
    <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
    <!-- script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
        import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
        const firebaseConfig = {
        };
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        window.auth = auth;
    <-- /script>
    <script type="module" src="auth.js"></script>
</head>
<body>
<h1>Sign In with Google</h1>

<button id="googleSignIn">Sign In with Google</button>

<?php if (isset($_SESSION['user_id'])): ?>
    <button id="logoutButton">Logout</button>
    <button id="deleteAccount">Delete My Account</button>
<?php endif; ?>

<div id="message"></div>
</body>
</html>