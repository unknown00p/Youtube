import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./config";

// configure storage client for backblaze
export const S3_client = new S3Client({
    credentials:{
        accessKeyId: config.B2_ACCESS_KEY_ID,
        secretAccessKey: config.B2_SECRET_ACCESS_KEY
    },
    region: config.B2_REGION,
    endpoint: config.B2_ENDPOINT
})