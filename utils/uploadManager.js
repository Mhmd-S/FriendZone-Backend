import * as Upload from "upload-js-full";
import fetch from "node-fetch";


const uploadManager = new Upload.UploadManager(
  new Upload.Configuration({
    fetchApi: fetch,
    apiKey: process.env.uploadIO_key,
  })
);

const uploadImage = (id,dataImage) => {
    uploadManager
    .upload({

      // ---------
      // Required:
      // ---------

      accountId: "FW25bRD", // This is your account ID.

      // Supported types for 'data' field:
      // - String
      // - Blob
      // - Buffer
      // - ReadableStream (Node.js), e.g. fs.createReadStream("file.txt")
      data: dataImage,

      // Required when: 'data' is a stream.
      // size: 5098,

      // ---------
      // Optional:
      // ---------

      // Required when: 'data' is a stream, buffer, or string.
      mime: "text/plain",

      // Required when: 'data' is a stream, buffer, or string.
      originalFileName: f`${id}.txt`,

      // Supported when: 'data' is not a stream.
    //   maxConcurrentUploadParts: 4,

      metadata: {
        // Up to 2KB of arbitrary JSON.
        productId: 60891
      },

      tags: [
        // Up to 25 tags per file.
        "example_tag"
      ],

      path: {
        // See path variables: https://upload.io/dashboard/docs/path-variables
        folderPath: `/profile_mages/${id}`,
        fileName: "{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}"
      },

      cancellationToken: {
        // Set to 'true' after invoking 'upload' to cancel the upload.
        isCancelled: false
      }
    })
        .then(({ fileUrl, filePath }) => {
            // --------------------------------------------
            // File successfully uploaded!
            // --------------------------------------------
            // The 'filePath' uniquely identifies the file,
            // and is what you should save to your DB.
            // --------------------------------------------
            return fileUrl;
        })
        .catch(err => {
            console.log(err);
        })
}

export default uploadImage;