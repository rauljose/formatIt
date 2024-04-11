// main.js
// main.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

navigator.serviceWorker.onmessage = function(event) {
    // Check the current page
    let currentPage = window.location.pathname;

    if (currentPage === '/index.html') {
        // Respond differently if the current page is index.html
        // For example, you might want to show a notification instead of appending the message to the screen div
    } else if (currentPage === '/chat.html') {
        // Append the last received message to the screen div
        let screenDiv = document.getElementById('screen');
        let message = document.createElement('p');
        message.textContent = event.data.message;
        screenDiv.appendChild(message);
    }
};
