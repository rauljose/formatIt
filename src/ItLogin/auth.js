
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    deleteUser,
    reauthenticateWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
const firebaseConfig = {
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

/*
cuando es import del head
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
const auth = window.auth;
const provider = new GoogleAuthProvider();
*/
// Google Sign In
document.getElementById('googleSignIn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            createSession(user);
        })
        .catch((error) => {
            document.getElementById('message').textContent = error.message;
        });
});

// Create session
function createSession(user) {
    user.getIdToken().then((idToken) => {
        // Send the ID token to your server
        fetch('create_session.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `idToken=${encodeURIComponent(idToken)}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'dashboard.php';
                } else {
                    document.getElementById('message').textContent = 'Session creation failed';
                }
            })
            .catch(error => {
                document.getElementById('message').textContent = 'An error occurred';
            });
    });
}

// Logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            // Sign-out successful, now destroy the PHP session
            fetch('logout.php')
                .then(() => {
                    window.location.href = 'index.php';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                });
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    });
}

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        createSession(user);
    } else {
        // User is signed out
        fetch('logout.php')
            .then(() => {
                window.location.href = 'index.php';
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    }
});

// Delete account functionality
document.getElementById('deleteAccount').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Re-authenticate the user
            await reauthenticateWithPopup(user, provider);

            // Delete the user from Firebase
            await deleteUser(user);

            // Send request to delete user data from your server
            const response = await fetch('delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken: await user.getIdToken() }),
            });

            const result = await response.json();

            if (result.success) {
                console.log("User account deleted successfully");
                window.location.href = 'index.php'; // Redirect to home page
            } else {
                console.error("Failed to delete user data from server:", result.error);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    } else {
        console.error("No user is currently signed in");
    }
});