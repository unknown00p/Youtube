import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const createProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    // logic to create a user profile
    const { username, profilePicture, bannerImage, channelName, bio } = req.body;


  }
);
