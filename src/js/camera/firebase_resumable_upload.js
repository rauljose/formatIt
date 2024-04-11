// Create a reference to the file to upload
var storageRef = firebase.storage().ref();
var fileRef = storageRef.child('images/image.jpg');

// Create the file metadata
var metadata = {
  contentType: 'image/jpeg'
};

// Upload the file and metadata
var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  },
  function(error) {
    // Handle unsuccessful uploads, you may want to implement retry logic here
  },
  function() {
    // Upload completed successfully, now we can get the download URL
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
    });
  }
);