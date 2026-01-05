import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const signUp = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
});


export {signUp}