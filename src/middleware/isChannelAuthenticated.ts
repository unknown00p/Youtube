import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { User } from "../models/user.models";
import { Channel } from "../models/channel.models";
import { ApiError } from "../utils/errorHandler";

export const channelAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const channelId = req.params.channelId;
    const userId = req.user?._id;

    if (!channelId) {
        throw new ApiError(400, "channel id is required")
    }

    if (!userId) {
        throw new ApiError(400, "user id is required")
    }

    const channel = await Channel.findById(channelId).select("ownerId");

    if (!channel) {
        throw new ApiError(404,"channel does not exits")
    }

    if (channel?.ownerId.toString() !== userId.toString()) {
        throw new ApiError(403, "channel is not authorized")
    }

    next()
  },
);