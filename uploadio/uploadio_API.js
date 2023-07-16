import * as Upload from "upload-js-full";
import fetch from "node-fetch";
import { AppError } from "../utils/errorHandler";
import fs from 'fs';

const uploadManager = new Upload.UploadManager(
  new Upload.Configuration({
    fetchApi: fetch,
    apiKey: process.env.UPLOADIO_KEY, 
  })
);

const fileApi = new Upload.FileApi(
  new Upload.Configuration({
    fetchApi: fetch,
    apiKey: process.env.UPLOADIO_KEY,
  })
)

export const uploadImage = async(file, destination = 'profile') => {
  try {
    const buffer = fs.readFileSync(file.filepath);

    const result = uploadManager.upload({
      accountId: "FW25bRD", // This is your account ID.
      // Supported types for 'data' field:
      // - String
      // - Blob
      // - Buffer
      // - ReadableStream (Node.js), e.g. fs.createReadStream("file.txt")
      data: buffer,
      mime: file.mimetype,
      originalFileName: file.name,
      path: {
        folderPath: destination === "profile" ? "/profile_images" : "/profile_headers",
        fileName: "{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}"
      },
      cancellationToken: {
        // Set to 'true' after invoking 'upload' to cancel the upload.
        isCancelled: false
      }
    });

    fs.unlink(file.filepath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    });

    return result.then(({ fileUrl, filePath }) => fileUrl);
  } catch (e) {
    console.log(e);
    throw new AppError(500, 'Could not process the upload');
  }
};

export const deleteImage = async(filePath) => {
  try {
    await fileApi
      .deleteFile({
        accountId: "FW25bRD", // This is your account ID.
        filePath: filePath
      })
    return true;
  } catch(err) {
    console.log(err);
    return err;
  }
}