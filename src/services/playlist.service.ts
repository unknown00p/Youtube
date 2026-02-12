import type mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/errorHandler";
import { Video } from "../models/video.models";

interface ICreatePlaylist {
  ownerId: string;
  name: string;
  description?: string;
  visibility: "public" | "private";
  videoId: mongoose.Types.ObjectId;
  addedAt: string;
  position: number;
}
interface IEditPlaylist {
  name?: string;
  description?: string;
  visibility?: "public" | "private";
}

async function createPlaylist_service({
  ownerId,
  name,
  description,
  visibility,
  videoId,
  position,
}: ICreatePlaylist) {

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video Id is not valid");
  }

  if (visibility == "public" && video.visibility !== "public") {
    throw new ApiError(400, "Video must be public to be added to this playlist");
  }

  const playlist = await Playlist.create({
    ownerId,
    name,
    description,
    visibility,
    videos: [
      {
        videoId: videoId,
        addedAt: new Date(),
        position: position,
      },
    ],
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  return playlist;
}

async function editPlaylist_service({
  name,
  description,
  visibility,
}:IEditPlaylist) {
  
}

export { createPlaylist_service };
