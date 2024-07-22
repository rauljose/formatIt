import { onAuthStateChanged, onIdTokenChanged, getIdTokenResult } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const auth = window.auth;

// 1. Using onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, you can get a fresh token here
        user.getIdToken(true).then((idToken) => {
            // Send token to your backend via HTTPS
            console.log("Fresh token:", idToken);
        });
    } else {
        // User is signed out
        console.log("User signed out");
    }
});

// 2. Using onIdTokenChanged
onIdTokenChanged(auth, (user) => {
    if (user) {
        // Token has changed, get the new token
        user.getIdToken().then((idToken) => {
            // Send token to your backend via HTTPS
            console.log("Token changed:", idToken);
        });
    }
});

// 3. Manually checking token expiration
function checkTokenExpiration() {
    const user = auth.currentUser;
    if (user) {
        getIdTokenResult(user).then((idTokenResult) => {
            // Check if token is expired or about to expire
            const expirationTime = new Date(idTokenResult.expirationTime).getTime();
            const currentTime = new Date().getTime();
            const timeToExpire = expirationTime - currentTime;

            if (timeToExpire <= 5 * 60 * 1000) { // 5 minutes or less until expiration
                // Token is about to expire, refresh it
                user.getIdToken(true).then((freshToken) => {
                    console.log("Refreshed token:", freshToken);
                    // Send the fresh token to your backend
                });
            }
        });
    }
}

// Check token expiration every 5 minutes
setInterval(checkTokenExpiration, 5 * 60 * 1000);

function sendToken(auth) {
    const user = auth.currentUser;
    const idToken = await user.getIdToken();
    fetch('your_php_endpoint.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: idToken }),
    });
}
