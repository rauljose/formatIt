// serviceWorker.js
self.addEventListener('push', function(event) {
    if (event.data) {
        // Parse the data from the server
        let data = event.data.json();

        // Post a message to the client
        clients.matchAll().then(clients => {
            if (clients.length) { // if there is at least one client
                clients[0].postMessage(data);
            } else {
                // Display a notification
                self.registration.showNotification(data.title, {
                    body: data.message,
                    icon: '/icon.png'
                });
            }
        });
    }
});

// Listen for the notificationclick event
self.addEventListener('notificationclick', function(event) {
    // Close the notification
    event.notification.close();

    // Open the website
    event.waitUntil(
        clients.openWindow('/chat.html')
    );
});