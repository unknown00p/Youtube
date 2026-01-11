import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as z from "zod";
import { signup_service } from "../services/auth.service";
import { ApiResponse } from "../utils/responseHandler";

const reqData = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const signup_controller = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = reqData.parse(req.body);

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

export { signup_controller };
