import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { subscribeToChannel_service } from "../services/subscription.service";
import { ApiError } from "../utils/errorHandler";

const subscribeTochannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriberId = req.user?._id;
    const { channelId } = req.params;

    if (!subscriberId || !channelId) {
      throw new ApiError(400, "Both subscriberId and channelId are required");
    }

    const subscription = await subscribeToChannel_service({
      subscriberId,
      channelId,
    });
  },
);
