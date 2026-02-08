import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import { likeAndUnlikeVideo_service } from "../services/like.service";

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

    const like = await likeAndUnlikeVideo_service(channelId, videoId);

    return res
      .status(200)
      .json({ message: "video liked successfully", like /* lol */ });
  },
);

export { likeVideo_controller };
