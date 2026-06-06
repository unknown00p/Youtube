import { Views } from "../models/views.model";
import { ApiError } from "../utils/errorHandler";

async function addviews(videoId: string, userId: string) {
  const views = await Views.create({
    video_id: videoId,
    user_id: userId,
  });

  if (!views) {
    throw new ApiError(500, "Failed to add view");
  }

  return views;
}