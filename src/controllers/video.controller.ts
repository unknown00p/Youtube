import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  UploadVideo_z_data,
  UpdateVideo_z_data,
  GetAllVideo_z_data,
} from "../zod/video.z";
import {
  getAllVideoService,
  getVideoByIdService,
  updateVideoService,
  uploadVideo_service,
} from "../services/video.service";
import { ApiError } from "../utils/errorHandler";
import { ApiResponse } from "../utils/responseHandler";

const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  // logic to upload a video
  const {
    video_url,
    thumbnail_url,
    duration,
    title,
    description,
    visibility,
    public_id,
  } = UploadVideo_z_data.parse(req.body);
  const channelId = req.params.channelId;

  if (!channelId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const video = await uploadVideo_service({
    video_url,
    thumbnail_url,
    duration,
    title,
    description,
    visibility,
    public_id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "video uploaded sucessfully", video));
});

const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, videoid } = UpdateVideo_z_data.parse(req.params);

  const video = await updateVideoService({
    videoid,
    title,
    description,
  });
});

const getVideoById = asyncHandler(async (req: Request, res: Response) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    throw new ApiError(404, "please provide videoId");
  }

  const video = await getVideoByIdService(videoId);

  res.status(200).json(new ApiResponse(200, "got video successfully", video));
});

const getAllVideo = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = GetAllVideo_z_data.parse(req.params);

  const videos = await getAllVideoService({ page, limit });

  res
    .status(200)
    .json(new ApiResponse(200, "got all videos succefully", videos));
});

export { uploadVideo, updateVideo, getVideoById, getAllVideo };
