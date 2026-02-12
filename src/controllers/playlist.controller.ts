import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { createPlaylist_service } from "../services/playlist.service";
import { ApiError } from "../utils/errorHandler";
import { playlist_z_data } from "../zod/playlist.z";
import mongoose from "mongoose";
const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.params.channelId;
  const videoId = req.params.videoId;
  const { name, visibility, position, description } = playlist_z_data.parse(
    req.body,
  );

  if (!ownerId) {
    throw new ApiError(400, "unauthorized user");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const playlist = await createPlaylist_service({
    ownerId,
    name,
    description,
    visibility,
    videoId: new mongoose.Types.ObjectId(videoId),
    addedAt: new Date().toISOString(),
    position,
  });
});
