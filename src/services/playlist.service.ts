import type mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/errorHandler";

interface ICreatePlaylist {
  ownerId: string;
  name: string;
  visibility: "public" | "private";
  videoId: mongoose.Types.ObjectId;
  addedAt: string,
  position: number,
}

async function createPlaylist_service({ ownerId, name, visibility,videoId, position }: ICreatePlaylist) {
  const playlist = await Playlist.create({
    ownerId,
    name,
    visibility,
    videos: [
      {
        videoId: videoId,
        addedAt: new Date(),
        position: position
      }
    ]
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  return playlist;
}

export {
  createPlaylist_service,
}