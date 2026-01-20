import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getSubscribedChannelsOfUser_service, subscribeToChannel_service, unSubscribeToChannel_service } from "../services/subscription.service";
import { ApiError } from "../utils/errorHandler";
import { ApiResponse } from '../utils/responseHandler';
import z from "zod";

const pageAndLimit = z.object(
  {
    page: z.int().min(1),
    limit: z.int().min(1).max(100),
  }
)

const subscribeTochannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriberId = req.user?._id;
    const { channelId } = req.params;

    if (!subscriberId || !channelId) {
      throw new ApiError(401, "Both subscriberId and channelId are required");
    }

    const subscription = await subscribeToChannel_service({
      subscriberId,
      channelId,
    });

    res.status(201).json(
      new ApiResponse(201, "Subscribed to channel successfully", subscription)
    )
  },
);

const unSubscribeTochannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriberId = req.user?._id;
    const { channelId } = req.params;

    if (!subscriberId || !channelId) {
      throw new ApiError(401, "Both subscriberId and channelId are required");
    }

    const subscription = await unSubscribeToChannel_service({
      subscriberId,
      channelId,
    });

    res.status(201).json(
      new ApiResponse(201, "unSubscribed to channel successfully", subscription)
    )
  },
);

const getSubscribedChannelsOfUser_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 10;

    const { page, limit } = pageAndLimit.parse(req.query);

    if (!userId) {
      throw new ApiError(401, "userId is required");
    }

    const subscriptions = await getSubscribedChannelsOfUser_service({
      userId,
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(200, "Subscribed channels fetched successfully", subscriptions)
    );
  },
);

export {
  subscribeTochannel_controller,
  unSubscribeTochannel_controller,
  getSubscribedChannelsOfUser_controller,
}