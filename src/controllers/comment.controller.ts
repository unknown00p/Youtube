import type { Request, Response } from "express";
import { ApiResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/errorHandler";
import { asyncHandler } from "../utils/asyncFunctionWarper";


const createComment_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const { content, videoId } = req.body;
    const userId = req.user?._id;

    if (!userId || !videoId || !content) {
      throw new ApiError(400, "User ID, Video ID and Content are required");
    }

    const comment = await createComment_service({
      content,
      videoId,
      userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Comment created successfully", comment));
  },
);

const editComment_Controller = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const commentId = req.params.id;
  const userId = req.user?._id;
  
  if (!userId || !commentId || !content) {
    throw new ApiError(400, "User ID, Comment ID and Content are required");
  }

  const comment = await editComment_service({
    content,
    commentId,
    userId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Comment edited successfully", comment));
});

const deleteComment_Controller = asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const userId = req.user?._id;
    if (!userId || !commentId) {
        throw new ApiError(400, "User ID and Comment ID are required");
    }

  await deleteComment_service({
    commentId,
    userId,
  });

    res
      .status(200)
      .json(new ApiResponse(200, "Comment deleted successfully", null));

});

const getAllCommentsOfaVideo_Controller = asyncHandler(async (req: Request, res: Response) => {
  const videoId = req.params.videoId;
  const userId = req.user?._id;

  if (!userId || !videoId) {
    throw new ApiError(400, "User ID and Video ID are required");
  }

  const comments = await getAllCommentsOfaVideo_service({ videoId, userId });

  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});