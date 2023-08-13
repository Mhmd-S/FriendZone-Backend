import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "./errorHandler";
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({ 
    region: process.env.S3_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    endpoint: process.env.S3_LOCATION,
});

const extractKeyFromUrl = (url) => {
  const splitUrl = url.split("/");
  const key = `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1]}`
  return key;
}

export const deleteObjectFromBucket = async(url) => {
  const key = extractKeyFromUrl(url);
  const commandInput = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }

  const command = new DeleteObjectCommand(commandInput);
  
  try{
    const result = await s3.send(command);
    console.log(result);
    return result;
  }catch(err){
      console.log(err);
      throw new AppError(500, "Could not delete object from bucket")
  }
}

export const uploadPostImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `post_images/${Date.now().toString()}`)
    }
  })
})

export const uploadUserProfileImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      if (file.fieldname === 'profilePicture') {
        cb(null, `profile_images/${Date.now().toString()}`)
      } else {
        cb(null, `profile_headers/${Date.now().toString()}`)
      }
    }
  })
})