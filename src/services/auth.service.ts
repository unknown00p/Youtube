import { User, type UserDocument } from "../models/user.models";
import { ApiError } from "../utils/errorHandler";

type authType = {
  username: string;
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
    throw error
  }
}

async function signup_service({ username, email, password }: authType) {
  // rest of the logic goes here

  // check if any of the feilds is missing
  if (!username || !email || !password) {
    throw new ApiError(404, "please provide all signup fields");
  }

  // get the user from DB using email
  const isUser = await User.find({ email: email });

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

  return user;
}

export { signup_service };
