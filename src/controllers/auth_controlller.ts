import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as z from "zod"

const reqData = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

const signup_controller = asyncHandler(async (req: Request, res: Response) => {
    const {username,email,password} = reqData.parse(req.body)
});

export {signup_controller}