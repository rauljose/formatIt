// sw.js
self.addEventListener('push', function(event) {
    if (event.data) {
        // Parse the data from the server
        let data = event.data.json();

        // Fetch data from an API
        fetch('https://api.example.com')
            .then(response => response.json())
            .then(apiData => {
                // Display a notification
                self.registration.showNotification(data.title, {
                    body: apiData.message,
                    icon: '/icon.png'
                });
            });
    }
});

self.addEventListener('sync', function(event) {
    if (event.tag === 'syncApiCall') {
        event.waitUntil(
            fetch('https://api.example.com')
                .then(response => response.json())
                .then(apiData => {
                    // Display a notification
                    self.registration.showNotification('Sync Event', {
                        body: apiData.message,
                        icon: '/icon.png'
                    });
                })
        );
    }
});
// Check if the Notifications API is available
if ('Notification' in window) {
    // Check the current permission status
    if (Notification.permission === 'default') {
        // The user has not been asked yet, so ask for permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    } else if (Notification.permission === 'granted') {
        console.log('Notification permission has already been granted.');
    } else {
        console.log('Notification permission has been denied.');
    }
} else {
    console.log('Your browser does not support the Notifications API.');
}










if ('Notification' in window) {
    if (Notification.permission === 'denied') {
        // The user has previously denied notification permission
        // Show a message explaining how to enable notifications
        alert('To enable notifications, please go to your browser settings and allow notifications for this site.');
    }
}