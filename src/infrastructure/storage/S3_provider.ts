import { Upload } from "@aws-sdk/lib-storage"; // 2026 Standard for uploads
import { unlink } from "fs/promises";
import fs from 'fs';
import { S3_client } from "../../config/S3.config";

const uploadImageToS3 = async (file: Express.Multer.File): Promise<string> => {
    // 1. Prepare the file body (Stream or Buffer)
    let fileBody;
    if (file.path) {
        // DiskStorage: Create a stream
        fileBody = fs.createReadStream(file.path);
    } else {
        // MemoryStorage: Use the buffer directly
        fileBody = file.buffer;
    }

    // 2. Prepare the Unique Key
    const fileName = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    try {
        // 3. Use the Upload utility (Handles multipart automatically)
        const parallelUploads3 = new Upload({
            client: S3_client,
            params: {
                Bucket: process.env.B2_BUCKET_NAME,
                Key: fileName,
                Body: fileBody,
                ContentType: file.mimetype,
            },
            // Optional: concurrency configuration
            queueSize: 4, 
            partSize: 1024 * 1024 * 5, // 5MB chunks
        });

        // 4. Wait for upload to finish
        await parallelUploads3.done();

        // 5. Cleanup local file if it exists (DiskStorage)
        if (file.path) {
            await unlink(file.path);
        }

        // 6. Return the Public URL
        // Backblaze specific URL construction
        return `https://${process.env.B2_BUCKET_NAME}.s3.${process.env.B2_REGION}.backblazeb2.com/${fileName}`;

    } catch (error) {
        console.error("S3 Upload Error:", error);
        // Ensure cleanup happens even on error
        if (file.path) await unlink(file.path).catch(() => {}); 
        throw new Error("Failed to upload image.");
    }
};

/**
 * Handle Multiple Files
 */
const uploadMultipleImagesToS3 = async (files: Express.Multer.File[]): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadImageToS3(file));
    return Promise.all(uploadPromises);
};

export { uploadImageToS3, uploadMultipleImagesToS3 };