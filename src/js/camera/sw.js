// serviceWorker.js
self.addEventListener('sync', event => {
    if (event.tag === 'upload-image') {
        event.waitUntil(uploadImageFromIndexedDB());
    }
});

async function uploadImageFromIndexedDB() {
    let imageData = await getImageFromIndexedDB();
    if (imageData) {
        return fetch('/upload-endpoint', {
            method: 'POST',
            body: imageData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // If the upload is successful, remove the image data from IndexedDB
            return removeImageFromIndexedDB();
        });
    }
}