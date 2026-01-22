import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UploadVideo_z_data } from '../zod/video.z';
import { uploadVideo_service } from "../services/video.service";
import { ApiError } from "../utils/errorHandler";

const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
    // logic to upload a video
    const videoData = UploadVideo_z_data.parse(req.body)
    const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const video = await uploadVideo_service(videoData,channelId)
})