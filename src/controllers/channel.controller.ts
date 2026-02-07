import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  channelCreate_z_data,
  channelUpdate_z_data,
  addSectionToFeaturedTab_z_data,
} from "../zod/channel.z";
import {
  addSectionToFeaturedTab_service,
  createChannelProfile_service,
  getProfileOfChannel_service,
  getVideosOfChannel_service,
  updateChannelProfile_service,
  getHomeOfChannel_service,
  getPlaylistsOfChannel_service
} from "../services/channel.service";
import { ApiResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/errorHandler";

const createChannelProfile_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to create a user profile
    const { channelName, handleName, profilePicture } =
      channelCreate_z_data.parse(req.body);

    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const channel = await createChannelProfile_service({
      userId: userId as string,
      channelName,
      handleName,
      profilePicture,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Channel created successfully", channel));
  },
);

const updateChannelProfile_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to update a user profile
    const updateData = channelUpdate_z_data.parse(req.body);
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const channel = await updateChannelProfile_service(channelId, updateData);

    res
      .status(200)
      .json(new ApiResponse(200, "Channel updated successfully", channel));
  },
);

const getProfileOfChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const channel = await getProfileOfChannel_service(channelId);

    res
      .status(200)
      .json(new ApiResponse(200, "Channel fetched successfully", channel));
  },
);

const getVideosOfChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const videos = await getVideosOfChannel_service({
      channelId,
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Videos fetched successfully", videos));
  },
);

const getPlaylistsOfChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const playlists = await getPlaylistsOfChannel_service({
      channelId,
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Playlists fetched successfully", playlists));
  },
);

const addSectionToFeaturedTab_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to create a featured page for a channel
    const channelId = req.params.channelId;
    const { sectionKind, title, contentReferences, contentType, pinned } =
      addSectionToFeaturedTab_z_data.parse(req.body);

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    // Example logic for creating a featured page section
    const featuredPage = await addSectionToFeaturedTab_service({
      channelId,
      pinned,
      sectionKind,
      title,
      contentReferences,
      contentType,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Featured page created successfully",
          featuredPage,
        ),
      );
  },
);

const getHomeOfChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const homeSection = await getHomeOfChannel_service(channelId);

    res
      .status(200)
      .json(new ApiResponse(200, "Home section fetched successfully", homeSection));
  },
);

export {
  createChannelProfile_Controller,
  updateChannelProfile_Controller,
  getProfileOfChannel_Controller,
  getVideosOfChannel_Controller,
  addSectionToFeaturedTab_Controller,
  getHomeOfChannel_Controller,
  getPlaylistsOfChannel_Controller
};
