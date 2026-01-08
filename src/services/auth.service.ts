import { User } from "../models/user.models";
import { ApiError } from "../utils/errorHandler";

type authType = {
  username: string;
  email: string;
  password: string;
};

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
