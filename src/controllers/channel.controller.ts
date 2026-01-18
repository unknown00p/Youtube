import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { channel_z_data } from "../zod/channel.z";
import { createChannel_service } from "../services/channel.service";
import { ApiResponse } from "../utils/responseHandler";

const createChannel_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to create a user profile
    const {
      channelName,
      handleName,
      profilePicture,
    } = channel_z_data.parse(req.body);

    const userId = req.user?._id;

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

export { createChannel_Controller };