import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  UploadVideo_z_data,
  UpdateVideo_z_data,
  GetAllVideo_z_data,
  GetAllVideoOfUser_z_data,
  ToggalVideoVisibillity_z_data,
} from "../zod/video.z";
import {
  getAllVideoService,
  getAllVideosOfUserService,
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
  const { videoid } = req.params;
  const { title, description } = UpdateVideo_z_data.parse(req.query);

  if (!videoid) {
    throw new ApiError(404, "please provide videoId");
  }

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

const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = GetAllVideo_z_data.parse(req.params);

  const videos = await getAllVideoService({ page, limit });

  res
    .status(200)
    .json(new ApiResponse(200, "got all videos succefully", videos));
});

const getAllVideosOfUser = asyncHandler(async (req: Request, res: Response) => {
  const { channelId, page, limit } = GetAllVideoOfUser_z_data.parse(req.params);

  const videos = await getAllVideosOfUserService({ channelId, page, limit });

  res
    .status(200)
    .json(new ApiResponse(200, "got all videos of user succefully", videos));
});

const addViewsToVideos = asyncHandler(async(req: Request, res: Response)=>{
  
})

const toggleVideoVisibility = asyncHandler(
  async (req: Request, res: Response) => {
    const videoId = req.params.videoId;
    const { visibility } = ToggalVideoVisibillity_z_data.parse(req.query);
  },
);

export {
  uploadVideo,
  updateVideo,
  getVideoById,
  getAllVideos,
  getAllVideosOfUser,
};
