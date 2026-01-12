import { User, type UserDocument } from "../models/user.models";
import { ApiError } from "../utils/errorHandler";

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

async function signup_service({ username, email, password }: authType) {
  // rest of the logic goes here

  // check if any of the feilds is missing
  if (!username || !email || !password) {
    throw new ApiError(400, "please provide all signup fields");
  }

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

async function signin_service({ email, password }: authType) {
  // rest of the logic goes here

  // check if any of the feilds is missing
  if (!email || !password) {
    throw new ApiError(400, "please provide all signip fields");
  }

  // get the user from DB using email
  const user = await User.findOne({ email: email });

  // check if the user aleardy exists in database(if yes user is already signed up)
  if (!user) {
    throw new ApiError(400, "user does not exists please signup please");
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

async function signout_service(userId: string) {
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

export { signup_service, signin_service, signout_service };