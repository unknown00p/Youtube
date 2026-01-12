import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import { ApiError } from "../utils/errorHandler";
import { User } from "../models/user.models";

interface MyTokenPayload extends JwtPayload {
  _id: string;
  email: string;
  username: string;
}

async function isUser_loggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // we are getting the accessToken from users http request
    const token = req.cookies["accessToken"];

    //checking if we get the token or not
    if (!token) {
      throw Error("access token does not found");
    }

    // verifing the token with secret token in .env and getting payload
    const verify = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET
    ) as MyTokenPayload;

    if (!verify) {
      throw Error("access token is invalid");
    }

    // finding user by id in DB
    const user = await User.findById({ _id: verify._id });

    if (!user) {
      throw Error("cannot find user");
    }

    // attach founded user to req
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
}
