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

export interface IUpdateVideoData {
  videoid: string;
  title: string;
  description: string;
}

export interface IGetAllVideoData {
  channelId: string;
  page: number;
  limit: string;
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

  if (!upload) {
    throw new ApiError(404, "got error while uploading video");
  }

  return {
    upload,
  };
}

async function updateVideoService({
  videoid,
  title,
  description,
}: IUpdateVideoData) {
  const updateVideo = await Video.findByIdAndUpdate(videoid, {
    title,
    description,
  });

  if (!updateVideo) {
    throw new ApiError(404, "got error while updating video");
  }

  return {
    updateVideo,
  };
}

async function getVideoByIdService(videoId: string) {
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "got error while getting video");
  }

  return {
    video,
  };
}

async function getAllVideoService({
  page,
  limit,
}: {
  page: number;
  limit: string;
}) {
  const videos = await Video.find()
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));

  if (!videos) {
    throw new ApiError(404, "got error while getting all videos");
  }

  return videos;
}

async function getAllVideosOfUserService({
  channelId,
  page,
  limit,
}: IGetAllVideoData) {
  const videos = await Video.find({ channel_id: channelId })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));

  if (!videos) {
    throw new ApiError(404, "got error while getting all videos");
  }

  return videos
}

export {
  uploadVideo_service,
  updateVideoService,
  getVideoByIdService,
  getAllVideoService,
  getAllVideosOfUserService,
};
