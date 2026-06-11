import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { UploadVideo_z_data } from "../zod/video.z";
import { uploadVideo_service } from "../services/video.service";
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

export { uploadVideo };
