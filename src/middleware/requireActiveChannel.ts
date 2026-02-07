import type { Request, Response, NextFunction } from "express";
import { Channel } from "../models/channel.models";
import { ApiError } from "../utils/errorHandler";
import { asyncHandler } from "../utils/asyncFunctionWarper";

export const requireActiveChannel = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const channelId = req.params.channelId;

    if (!channelId) {
      throw new ApiError(400, "ChannelId is required");
    }

    const channel = await Channel.findOne({
      _id:channelId,
      state: "active",
    }).select("_id");

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    next();
  },
);
