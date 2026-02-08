import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  getSubscribedChannelsOfUser_service,
  subscribeToChannel_service,
  unSubscribeToChannel_service,
} from "../services/subscription.service";
import { ApiError } from "../utils/errorHandler";
import { ApiResponse } from "../utils/responseHandler";
import z from "zod";

const pageAndLimit = z.object({
  page: z.int().min(1),
  limit: z.int().min(1).max(100),
});

const subscribeTochannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriberId = req.params.subscriberId;
    const channelId = req.params.channelId;

    if (!subscriberId || !channelId) {
      throw new ApiError(401, "Both subscriberId and channelId are required");
    }

    const subscription = await subscribeToChannel_service({
      subscriberId,
      channelId,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Subscribed to channel successfully",
          subscription,
        ),
      );
  },
);

const unSubscribeTochannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriberId = req.params.subscriberId;
    const channelId = req.params.channelId;

    if (!subscriberId || !channelId) {
      throw new ApiError(401, "Both subscriberId and channelId are required");
    }

    const subscription = await unSubscribeToChannel_service({
      subscriberId,
      channelId,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "unSubscribed to channel successfully",
          subscription,
        ),
      );
  },
);

const getSubscribedChannelsOfUserChannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 10;

    const { page, limit } = pageAndLimit.parse(req.query);

    if (!channelId) {
      throw new ApiError(401, "channelId is required");
    }

    const subscriptions = await getSubscribedChannelsOfUser_service({
      channelId,
      page,
      limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Subscribed channels fetched successfully",
          subscriptions,
        ),
      );
  },
);

export {
  subscribeTochannel_controller,
  unSubscribeTochannel_controller,
  getSubscribedChannelsOfUserChannel_controller,
};
