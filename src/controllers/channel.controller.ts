import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { channelCreate_z_data, channelUpdate_z_data } from "../zod/channel.z";
import {
  createChannel_service,
  getChannelById_service,
  updateChannel_service,
} from "../services/channel.service";
import { ApiResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/errorHandler";

const createChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to create a user profile
    const { channelName, handleName, profilePicture } =
      channelCreate_z_data.parse(req.body);

    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const channel = await createChannel_service({
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

const updateChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to update a user profile
    const updateData = channelUpdate_z_data.parse(req.body);
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const channel = await updateChannel_service(channelId, updateData);

    res
      .status(200)
      .json(new ApiResponse(200, "Channel updated successfully", channel));
  },
);

const getChannelById_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }

    const channel = await getChannelById_service(channelId);

    res
      .status(200)
      .json(new ApiResponse(200, "Channel fetched successfully", channel));
  },
);

export {
  createChannel_Controller,
  updateChannel_Controller,
  getChannelById_Controller,
};
