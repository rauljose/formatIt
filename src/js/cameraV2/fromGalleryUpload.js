document.getElementById('myFileInput').addEventListener('change', function(e){
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Set the canvas dimensions to the desired size
            canvas.width = 600;
            canvas.height = 480;

            // Draw the scaled image on the canvas
            ctx.drawImage(this, 0, 0, 600, 480);

            // Convert the canvas to a blob
            canvas.toBlob(function(blob) {
                // Create a new File object and append it to the FormData object
                var newFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                // Initialize and configure Resumable.js for the file upload
                var r = new Resumable({
                    target: '/path/to/api/endpoint',
                    chunkSize: 1*1024*1024,
                    simultaneousUploads: 3
                });
                r.addFile(newFile);

                r.on('uploadStart', function() {
                    document.getElementById('progressBar').innerText = 'Upload has started...';
                });

                // Show progress
                r.on('fileProgress', function (file) {
                    var progress = Math.floor(file.progress() * 100) + '%';
                    document.getElementById('progressBar').innerText = 'Upload progress: ' + progress;
                });

                r.on('fileSuccess', function(file, message){
                    document.getElementById('progressBar').innerText = 'Upload completed!';
                });

                // Starts uploads
                r.upload();

            }, 'image/jpeg', 0.95); // Adjust output quality as needed
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});