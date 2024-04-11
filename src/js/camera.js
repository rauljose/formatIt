// Check if the MediaDevices API is available
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Try to access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // The camera is available and the user has granted permission
            // 'stream' is a MediaStream representing the video stream from the camera
            // You can use this stream to display the camera video in a video element, for example
            var video = document.querySelector('video');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch(function(err) {
            // An error occurred, which can mean that the user denied permission
            // You can provide a more detailed explanation to the user here
            alert('Access to the camera is required to take a picture. Please grant permission and try again.');
        });
} else {
    // The MediaDevices API is not available
    alert('Your browser does not support access to the camera.');
}