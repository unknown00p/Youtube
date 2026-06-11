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
  public_id: string;
  duration: number;
  tags?: string[];
  category?: string;
  language?: string;
  visibility: VideoVisibility;
  status?: VideoStatus;
}

async function uploadVideo_service({
  video_url,
  thumbnail_url,
  duration,
  title,
  description,
  visibility,
  public_id,
}: IUploadVideoData) {
  const upload = await Video.create({
    video_url,
    thumbnail_url,
    duration,
    title,
    description,
    visibility,
    public_id,
    status: "published",
  });

  return {
    upload
  }
}

export { uploadVideo_service };
