import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./config";
import { v2 as cloudinary } from "cloudinary";

// configure storage client for backblaze
// export const S3_client = new S3Client({
// credentials:{
//     accessKeyId: config.B2_ACCESS_KEY_ID,
//     secretAccessKey: config.B2_SECRET_ACCESS_KEY
// },
// region: config.B2_REGION,
// endpoint: config.B2_ENDPOINT
// })
export const cloudinary_config = cloudinary.config({
  cloud_name: config.CLODINARY_CLAUDE_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});
