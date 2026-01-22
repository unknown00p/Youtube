import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";
import * as z from "zod";
import {
  getCurrentUser_service,
  getUserById_service,
  refreshAccessToken_service,
  signIn_service,
  signOut_service,
  signUp_service,
} from "../services/auth.service";
import { ApiResponse } from "../utils/responseHandler";
import {
  getUserById_z_data,
  signin_z_data,
  signup_z_data,
} from "../zod/auth.z";
import { ApiError } from "../utils/errorHandler";

const signUp_controller = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = signup_z_data.parse(req.body);

  const { accessToken, refreshToken, safeUser } = await signUp_service({
    username,
    email,
    password,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(new ApiResponse(201, "User signed up successfully", { safeUser }));
});

const signIn_controller = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = signin_z_data.parse(req.body);

  const { accessToken, refreshToken, safeUser } = await signIn_service({
    email,
    password,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(new ApiResponse(201, "User signed in successfully", { safeUser }));
});

const signOut_controller = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "userId is required");
  }

  const { message } = await signOut_service(userId);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send(new ApiResponse(200, message, null));
});

const getCurrentUser_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "userId is required");
    }

    // logic to get current user details
    const safeUser = await getCurrentUser_service(userId);

    res
      .status(200)
      .send(new ApiResponse(200, "User fetched successfully", { safeUser }));
  },
);

const getUserById_controller = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = getUserById_z_data.parse(req.params);

    // logic to get user details by id
    const safeUser = await getUserById_service(userId);

    res
      .status(200)
      .send(new ApiResponse(200, "User fetched successfully", { safeUser }));
  },
);

const refreshAccessToken_controller = asyncHandler(
  async (req: Request, res: Response) => {
    // first get the refresh token from request
    const refreshTokenValue = req.cookies["refreshToken"];

    if (!refreshTokenValue) {
      throw new Error("refresh token not found");
    }

    // logic to refresh access token
    const { accessToken, refreshToken } =
      await refreshAccessToken_service(refreshTokenValue);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .send(
        new ApiResponse(200, "Access token refreshed successfully", {
          accessToken,
        }),
      );
  },
);

export {
  signUp_controller,
  signIn_controller,
  signOut_controller,
  getCurrentUser_controller,
  getUserById_controller,
  refreshAccessToken_controller,
};
