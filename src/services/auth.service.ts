import { User, type UserDocument } from "../models/user.models";
import { ApiError } from "../utils/errorHandler";

type authType = {
  username: string;
  email: string;
  password: string;
};

async function genrate_AccessRefresh_Token(userId: string) {
  try {
    // check if the user exists in DB or not
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "can't genrate cookie token becuse user does not exists in database"
      );
    }

    let accessToken = user.generate_accessToken();
    let refreshToken = user.generate_refreshToken();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
  }
}

async function signup_service({ username, email, password }: authType) {
  // rest of the logic goes here

  // check if any of the feilds is missing
  if (!username || !email || !password) {
    throw new ApiError(404, "please provide all signup fields");
  }

  // check if the user aleardy exists in database(if user already signup)
  const isUser = await User.find({ email: email });

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

  return user;
}

export { signup_service };
