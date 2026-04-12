import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { UploadVideo_z_data } from "../zod/video.z";
import { uploadVideo_service } from "../services/video.service";
import { ApiError } from "../utils/errorHandler";

type videoFileType = {
  video: Express.Multer.File[];
};
type thumbnailFileType = {
  thumbnail: Express.Multer.File[];
};

const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  // logic to upload a video
  const videoData = UploadVideo_z_data.parse(req.body);
  const channelId = req.params.channelId;
  const videoFile = req.files as videoFileType;
  const thumbnailFile = req.files as thumbnailFileType;

  if (!channelId) {
    throw new ApiError(401, "Unauthorized access");
  }

  if (!videoFile.video[0]) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailFile.thumbnail[0]) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const video = await uploadVideo_service(
    videoData,
    videoFile.video[0],
    thumbnailFile.thumbnail[0],
    channelId,
  );
});