import type { Request, Response } from "express";
import { ApiResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/errorHandler";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import {
  createComment_service,
  deleteComment_service,
  editComment_service,
  getAllCommentsOfaVideo_service,
} from "../services/comment.service";
import { comment_z_data } from "../zod/comment.z";

const createComment_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const { content } = comment_z_data.parse(req.body);
    const videoId = req.params.videoId;
    const userId = req.user?._id;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!videoId) throw new ApiError(400, "Video ID is required");

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

const editComment_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const { content } = comment_z_data.parse(req.body);
    const commentId = req.params.id;
    const userId = req.user?._id;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!commentId) throw new ApiError(400, "Comment ID is required");

    const comment = await editComment_service({
      content,
      commentId,
      userId,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Comment edited successfully", comment));
  },
);

const deleteComment_Controller = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

const getAllCommentsOfaVideo_Controller = asyncHandler(
  async (req: Request, res: Response) => {
    const videoId = req.params.videoId;
    const page = req.params.page || 1;
    const limit = req.params.limit || 10;

    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }

    const comments = await getAllCommentsOfaVideo_service({
      videoId,
      page: Number(page),
      limit: Number(limit),
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Comments fetched successfully", comments));
  },
);

export {
  createComment_Controller,
  editComment_Controller,
  deleteComment_Controller,
  getAllCommentsOfaVideo_Controller,
};
