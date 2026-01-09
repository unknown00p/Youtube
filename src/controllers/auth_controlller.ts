import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as z from "zod";
import { signup_service } from "../services/auth.service";

const reqData = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const signup_controller = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = reqData.parse(req.body);

  const user = await signup_service({ username, email, password });
});

export { signup_controller };