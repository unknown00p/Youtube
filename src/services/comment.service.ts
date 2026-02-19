import { Comment } from "../models/comment.models";
import { Video } from "../models/video.models";
import { ApiError } from "../utils/errorHandler";

interface ICreateComment {
  content: string;
  videoId: string;
  channelId: string;
}

interface IUpdateComment {
  content: string;
  commentId: string;
  channelId: string;
}

interface IGetCommentsOfVideo {
  videoId: string;
  page: number;
  limit: number;
}

async function createComment_service({
  content,
  videoId,
  channelId,
}: ICreateComment) {
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.isCommentEnabled == false) {
    throw new ApiError(403, "Comments are disabled for this video");
  }

  // increment comment count in video document

  const comment = await Comment.create({
    content,
    videoId,
    channelId,
  });

  return comment;
}

async function editComment_service({
  content,
  commentId,
  channelId,
}: IUpdateComment) {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, channelId },
    { content },
    { new: true },
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  return comment;
}

async function deleteComment_service({
  commentId,
  channelId,
}: {
  commentId: string;
  channelId: string;
}) {
  const comment = await Comment.findOneAndDelete({ _id: commentId, channelId });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  return;
}

async function getAllCommentsOfaVideo_service({
  videoId,
  page,
  limit,
}: IGetCommentsOfVideo) {
  const video = await Video.findById(videoId).select("isCommentEnabled");

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.isCommentEnabled == false) {
    throw new ApiError(403, "Comments are disabled for this video");
  }

  const skip = (page - 1) * limit;
  const comments = await Comment.find({ videoId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return comments;
}

export {
  createComment_service,
  editComment_service,
  deleteComment_service,
  getAllCommentsOfaVideo_service,
};
