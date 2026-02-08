import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncFunctionWarper";

const likeVideo_controller = asyncHandler(async(req: Request,res:Response)=>{
    const userId = req.user?._id
    const videoId = req.params.videoId
})