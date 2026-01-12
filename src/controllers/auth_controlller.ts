import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as z from "zod";
import {
  signin_service,
  signout_service,
  signup_service,
} from "../services/auth.service";
import { ApiResponse } from "../utils/responseHandler";
import { signin_z_data, signup_z_data } from "../zod/auth.z";

const signup_controller = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = signup_z_data.parse(req.body);

  const { accessToken, refreshToken, safeUser } = await signup_service({
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

const signin_controller = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = signin_z_data.parse(req.body);

  const { accessToken, refreshToken, safeUser } = await signin_service({
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

const signout_controller = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { message } = await signout_service(String(userId));

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

export { signup_controller, signin_controller, signout_controller };
