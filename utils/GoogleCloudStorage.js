const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'YOUR_PROJECT_ID',
  keyFilename: 'path/to/keyfile.json' 
});

const bucketName = 'YOUR_BUCKET_NAME';
const bucket = storage.bucket(bucketName);

export const uploadFileToStorage = (file, destination) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      destination,
      metadata: {
        contentType: file.type,
      },
    };

    bucket.upload(file.path, uploadOptions, (err, uploadedFile) => {
      if (err) {
        console.error('Error uploading file:', err);
        return reject(err);
      }

      // Delete the uploaded file from the local server
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });

      resolve(uploadedFile);
    });
  });
};