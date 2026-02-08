import { Like } from "../models/like.models";
import { Video } from "../models/video.models";
import { ApiError } from "../utils/errorHandler";
import { likeCountUpdateQueue } from "../infrastructure/queue";

async function likeAndUnlikeVideo_service(channelId: string, videoId: string) {
  const video = await Video.findById(videoId).select("visibility like_count");

  if (!video) {
    throw new ApiError(404, "Video id is incorrect");
  }

  if (video.visibility !== "public") {
    throw new ApiError(403, "this opration is not allowed in this video");
  }

  const likeResult = await Like.updateOne(
    { videoId, channelId },

    // create the document if its not exists in DB, if its exists then do nothing
    { $setOnInsert: { videoId, channelId } },
    { upsert: true },
  );

  if (likeResult.upsertedId) {
    likeCountUpdateQueue.add("increaseCount", {videoId});
    return {
      message: "video liked successfully",
    };
  }

  const dislikeResult = await Like.deleteOne({ channelId, videoId });
  if (dislikeResult.deletedCount > 0) {
    likeCountUpdateQueue.add("decreaseCount", {videoId});
    return {
      message: "video unliked successfully",
    };
  }
}

export { likeAndUnlikeVideo_service };
