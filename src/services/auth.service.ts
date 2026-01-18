import { config } from "../config/config";
import type { MyRefreshTokenPayload } from "../middleware/isUserLoggedIn";
import { User, type UserDocument } from "../models/user.models";
import { ApiError } from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import { createChannel_service } from "./channel.service";

type authType = {
  username?: string;
  email: string;
  password: string;
};

export async function genrate_AccessRefresh_Token(userId: string) {
  try {
    // get the user from DB using userId
    const user = await User.findById(userId);

    // check if the user exists in DB or not
    if (!user) {
      throw new ApiError(
        404,
        "can't genrate cookie token becuse user does not exists in database"
      );
    }

    // generate access and refresh tokens using methods(created in user schema file)
    let accessToken = user.generate_accessToken();
    let refreshToken = user.generate_refreshToken();

    // return the tokens
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function signUp_service({ username, email, password }: authType) {
  // rest of the logic goes here
  // get the user from DB using email
  const isUser = await User.findOne({ email: email });

  // check if the user aleardy exists in database(if yes user is already signed up)
  if (isUser) {
    throw new ApiError(400, "user already exists");
  }

  // register the user
  const user = await User.create({
    email,
    username,
    password,
  });

  if (!user) {
    throw new ApiError(400, "got while registring the user", user);
  }

  // generating access and refresh token
  const { accessToken, refreshToken } = await genrate_AccessRefresh_Token(
    user._id
  );

  // adding the generated refresh token to DB
  user.refreshToken = await Bun.password.hash(refreshToken);
  user.save();

  // saving the user with after removing refresh token and password from output
  let safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  return {
    accessToken,
    refreshToken,
    safeUser,
  };
}

async function signIn_service({ email, password }: authType) {
  // rest of the logic goes here
  // get the user from DB using email
  const user = await User.findOne({ email: email });

  // check if the user aleardy exists in database(if yes user is already signed up)
  if (!user) {
    throw new ApiError(400, "user does not exists please signup please");
  }

  // check if the given password is correct or not
  const isPasswordCorrect = await user.is_password_correct(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "incorrect password");
  }

  // generating access and refresh token
  const { accessToken, refreshToken } = await genrate_AccessRefresh_Token(
    user._id
  );

  // saving the user with after removing refresh token and password from output
  let safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  return {
    accessToken,
    refreshToken,
    safeUser,
  };
}

async function signOut_service(userId: string) {
  // get the user from DB using userId
  const user = await User.findById(userId);

  // check if the user exists in DB or not
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // clear the refresh token from DB
  user.refreshToken = undefined;
  user.save();

  return {
    message: "user signed out successfully",
  };
}

async function getCurrentUser_service(userId: string) {
  // get the user from DB using userId
  const user = await User.findById(userId);

  // check if the user exists in DB or not
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // return safe user data
  const safeUser = user.toObject();
  delete safeUser.refreshToken;
  delete safeUser.password;

  return safeUser;
}

async function getUserById_service(userId: string) {
  // get the user from DB using userId
  const user = await User.findById(userId);

  // check if the user exists in DB or not
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // return safe user data
  const safeUser = user.toObject();
  delete safeUser.refreshToken;
  delete safeUser.password;

  return safeUser;
}

async function refreshAccessToken_service(refreshTokenValue: string) {
  // check if the token is valid
  const valid = jwt.verify(
    refreshTokenValue,
    config.REFRESH_TOKEN_SECRET
  ) as MyRefreshTokenPayload;

  if (!valid) {
    throw new ApiError(401, "refresh token is invalid");
  }

  // find the user in DB based on the data from token
  const user = await User.findById(valid._id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // get the refresh token from DB
  const refreshTokenDB = user.refreshToken;

  const decodedRT = Bun.password.verify(
    refreshTokenValue,
    String(refreshTokenDB)
  );

  if (!decodedRT) {
    throw new ApiError(401, "refresh token is invalid");
  }

  // now generate a new access and refresh tokens
  const { accessToken, refreshToken } = await genrate_AccessRefresh_Token(
    String(user._id)
  );

  user.refreshToken = await Bun.password.hash(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
}

export {
  signUp_service,
  signIn_service,
  signOut_service,
  getCurrentUser_service,
  getUserById_service,
  refreshAccessToken_service,
};
