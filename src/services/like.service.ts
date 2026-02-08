import { Like } from "../models/like.models";
import { Video } from "../models/video.models";
import { ApiError } from "../utils/errorHandler";

async function likeVideo_service(channelId: string, videoId: string) {
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video id is incorrect");
  }

  if (video.visibility !== "public") {
    throw new ApiError(403, "this opration is not allowed in this video");
  }

  const like = await Like.create({
    channelId,
    videoId,
  });

  if (!like) {
    throw new ApiError(500, "Failed to like the video");
  }

  return true;
}

export { likeVideo_service };
