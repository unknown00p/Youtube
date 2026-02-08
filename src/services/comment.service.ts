import { Comment } from "../models/comment.models";
import { Video } from "../models/video.models";
import { ApiError } from "../utils/errorHandler";

interface ICreateComment {
  content: string;
  videoId: string;
  userId: string;
}

async function createComment_service({
  content,
  videoId,
  userId,
}: ICreateComment) {

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.isCommentEnabled == false) {
    throw new ApiError(403, "Comments are disabled for this video");
  }

  const comment = await Comment.create({
    content,
    videoId,
    userId,
  });

  return comment;
}

export { createComment_service };
