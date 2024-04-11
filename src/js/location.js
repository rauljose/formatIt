// Check if the Geolocation API is available
if (navigator.geolocation) {
    // Try to get the device's location
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // The user has granted permission and the location is available
            // 'position' is a GeolocationPosition object containing the device's location
            console.log('Latitude:', position.coords.latitude);
            console.log('Longitude:', position.coords.longitude);
        },
        function(error) {
            // An error occurred, which can mean that the user denied permission
            // You can provide a more detailed explanation to the user here
            console.error('Access to your location is required for this feature. Please grant permission and try again.');
        }
    );
} else {
    // The Geolocation API is not available
    console.error('Your browser does not support access to your location.');
}

// Check if the Geolocation API is available
if (navigator.geolocation) {
    let watchId;

    // Try to get the device's location
    watchId = navigator.geolocation.watchPosition(
        function(position) {
            // The user has granted permission and the location is available
            // 'position' is a GeolocationPosition object containing the device's location
            console.log('Latitude:', position.coords.latitude);
            console.log('Longitude:', position.coords.longitude);
        },
        function(error) {
            // An error occurred, which can mean that the user denied permission
            // You can provide a more detailed explanation to the user here
            console.error('Access to your location is required for this feature. Please grant permission and try again.');
        },
        {
            maximumAge: 600000, // Accept a cached position if it's no older than 10 minutes.
            timeout: 5000 // Wait for 5 seconds for the device to get a GPS fix.
        }
    );

    // Stop watching the position after 10 minutes
    setTimeout(() => {
        navigator.geolocation.clearWatch(watchId);
    }, 600000);
} else {
    // The Geolocation API is not available
    console.error('Your browser does not support access to your location.');
}