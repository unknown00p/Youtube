import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { addVideoToPlaylist_service, createPlaylist_service, editPlaylist_service, getPlaylistById_service, removeVideoFromPlaylist_service } from "../services/playlist.service";
import { ApiError } from "../utils/errorHandler";
import { playlist_z_data, edit_playlist_z_data } from '../zod/playlist.z';
import mongoose from "mongoose";
import { ApiResponse } from "../utils/responseHandler";

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

  res
    .status(201)
    .json(new ApiResponse(201, "Playlist created successfully", playlist
    ));
});

const editPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  const { name, description, visibility } = edit_playlist_z_data.parse(req.body);

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  const playlist = await editPlaylist_service({
    name,
    description,
    visibility,
    playlistId: playlistId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  const videoId = req.params.videoId;

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  } 

  const playlist = await addVideoToPlaylist_service({playlistId, videoId});

  res
    .status(200)
    .json(new ApiResponse(200, "Video added to playlist successfully", playlist));
});

const removeVideoFromPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  const videoId = req.params.videoId;

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const playlist = await removeVideoFromPlaylist_service({playlistId, videoId});

  res
    .status(200)
    .json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
});

const getPlaylistById = asyncHandler(async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  const playlist = await getPlaylistById_service(playlistId);
  
  res
    .status(200)
    .json(new ApiResponse(200, "Playlist retrieved successfully", playlist));
});

export {
  createPlaylist,
  editPlaylist,
  removeVideoFromPlaylist,
  addVideoToPlaylist,
  getPlaylistById
};