import { Upload } from "@aws-sdk/lib-storage"; // 2026 Standard for uploads
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { unlink } from "fs/promises";
import fs from "fs";
import { cloudinary_config } from '../../config/S3.config';
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config/config";

export const generateSignedUrl = () => {
  // Every signature is parametrized for the specific upload needed
  const paramsToSign = {
    timestamp: Math.floor(new Date().getTime() / 1000),
    folder: config.CLOUDINARY_UPLOAD_FOLDER,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    config.CLOUDINARY_SECRET,
  );

  return {
    signature,
    paramsToSign,
    cloudinary_key: config.CLOUDINARY_API_KEY
  };
};

// const getFileFromS3 = async (fileKey: string) => {
//   const command = new GetObjectCommand({
//     Bucket: process.env.B2_BUCKET_NAME,
//     Key: fileKey,
//   });

//   const file = await S3_client.send(command);

//   return file.Body;
// };