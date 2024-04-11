// main.js
function uploadImage(imageData) {
    fetch('/upload-endpoint', {
        method: 'POST',
        body: imageData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .catch(error => {
        // Save the image data to IndexedDB and register a sync event if the upload fails
        saveImageToIndexedDB(imageData).then(() => {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('upload-image');
            });
        });
    });
}