// import {
//   uploadFileToS3,
//   uploadMultipleFilesToS3,
// } from "../infrastructure/storage/S3_provider";
import { Video } from "../models/video.models";
import { getVideoDuration } from "../utils/getVideoDuration";
import { ApiError } from "../utils/errorHandler";
import { videoQueue } from "../infrastructure/queue";

export type VideoVisibility = "public" | "private" | "unlisted";
export type VideoStatus = "processing" | "published" | "failed";

export interface IUploadVideoData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  s3FileKey: string;
  tags: string[];
  category: string;
  language: string;
  visibility: VideoVisibility;
  status: VideoStatus;
}

// async function uploadVideo_service(
//   videoData: IUploadVideoData,
//   videoFile: Express.Multer.File,
//   thumbnailFile: Express.Multer.File,
//   channelId: string,
// ) {
//   // const files = [
//   //   videoFile,
//   //   thumbnailFile
//   // ]
//   // const {} = await uploadMultipleFilesToS3(files)

//   const videoFileData = await uploadFileToS3(videoFile);
//   const thumbnailFileData = await uploadFileToS3(thumbnailFile);

//   const duration = await getVideoDuration(videoFile.path);
//   console.log(`Duration: ${duration} seconds`);

//   const upload = await Video.create({
//     title: videoData.title,
//     description: videoData.description,
//     channel_id: channelId,
//     video_url: videoFileData.url,
//     thumbnail_url: thumbnailFileData.url,
//     duration: duration,
//     s3FileKey: videoFileData.key,
//     tags: videoData.tags,
//     category: videoData.category,
//     language: videoData.language,
//     visibility: videoData.visibility,
//     status: "processing",
//   });

//   if (!upload) {
//     throw new ApiError(500, "Video upload failed");
//   }

//   videoQueue.add("videoProcessing", {
//     videoId: upload.id,
//     s3FileKey: upload.s3FileKey,
//   });

//   return upload;
// }

// export { uploadVideo_service };