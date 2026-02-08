import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  getLikedVideosOfChannel_service,
  likeVideo_service,
  unlikeVideo_service,
} from "../services/like.service";

const likeVideo_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;

    if (!channelId) {
      return res.status(400).json({ message: "channelId are required" });
    }
    if (!videoId) {
      return res.status(400).json({ message: "videoId are required" });
    }

    const like = await likeVideo_service(channelId, videoId);

    return res
      .status(200)
      .json({ message: "video liked successfully", like /* lol */ });
  },
);

const unlikeVideo_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;

    if (!channelId) {
      return res.status(400).json({ message: "channelId are required" });
    }

    if (!videoId) {
      return res.status(400).json({ message: "videoId are required" });
    }

    const like = await unlikeVideo_service(channelId, videoId);

    return res
      .status(200)
      .json({ message: "video unliked successfully", like });
  },
);

const getLikedVideosOfChannel_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.params.channelId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!channelId) {
      return res.status(400).json({ message: "channelId are required" });
    }

    const likedVideos = await getLikedVideosOfChannel_service(
      channelId,
      page,
      limit,
    );

    return res
      .status(200)
      .json({ message: "liked videos retrieved successfully", likedVideos });
  },
);

export {
  likeVideo_controller,
  unlikeVideo_controller,
  getLikedVideosOfChannel_controller,
};
