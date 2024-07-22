
function setupCamera() {
    var videoElement = document.getElementById('video');
    var cameraSelect = document.getElementById('cameraSelect');
    var buttonTakePicture = document.getElementById('takePicture');
    var buttonRetry = document.getElementById('cameraRetry');
    var buttonUpload = document.getElementById('fotoUploadBtn');

    if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices()
            .then(populateCameraList)
            .catch(handleCameraError);
    } else {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: { facingMode: 'environment' }},
                function(stream) {
                    // Set your video source to the stream from the environment camera.
                },
                function(error) {
                    console.log("An error occurred: ", error);
                }
            );
        } else {
            console.log("getUserMedia not supported on your browser");
        }
    }

    function populateCameraList(devices) {
        devices.forEach(function(device) {
            if (device.kind === 'videoinput') {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `# ${cameraSelect.length + 1}`;
                cameraSelect.add(option);
            }
        });

        // Start with the first camera (if any)
        if (cameraSelect.options.length > 0) {
            startStream(cameraSelect.value);
        }
    }

    function handleCameraError(error) {
        alert('Error accessing cameras: ' + error);
    }

    function startStream(deviceId) {
        var constraints = {
            video: { deviceId: deviceId ? { exact: deviceId } : true } // Select specific camera
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                videoElement.srcObject = stream;
                videoElement.play();
            })
            .catch(handleCameraError);
    }

}
