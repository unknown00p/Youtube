import mongoose, { Schema, type HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import type { NextFunction } from "express";

export interface IUser {
  _id: string;
  email: string;
  password?: string; // Optional based on auth providers
  googleId?: string;
  githubId?: string;
  refreshToken?: string;
  username: string;
  channelName?: string;
  profilePicture?: string | null;
  bannerImage?: string | null;
  bio?: string | null;
  isChannelSetup: boolean;
  stats: {
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
  };
  channelSetupAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// here we are defining types for schema's instance methods
export interface UserMethods {
  generate_accessToken(): string;
  generate_refreshToken(): string;
  is_password_correct(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, UserMethods>;

const passwordRequired = function (this: IUser): boolean {
  return !this.googleId && !this.githubId;
};

// userschema have user data types and also the instance methods types. the empty object represent static method we don't have any static method currently that's why its empty
const userSchema = new Schema<IUser, {}, UserMethods>(
  {
    // Required for ALL users (signup)
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    }, // indexed
    password: {
      type: String,
      required: passwordRequired,
    },

    // Auth providers (optional)
    googleId: { type: String, sparse: true },
    githubId: { type: String, sparse: true },

    // Required for ALL users but with defaults
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    }, // indexed

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// has the password before saving the document into database
userSchema.pre("save", async function () {
  // we are checking if password is already hashed or there is not any password if true don't continew and terminate the function
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    // we are using bun build in method to hash the password
    this.password = await Bun.password.hash(this.password);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
});

// created a instance method for generating access_token
userSchema.methods.generate_accessToken = function () {
  // using sign method of jwt for creating access_token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    config.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRATION as any,
    }
  );
};

// check if given password is correct(match with existing password from DB)
userSchema.methods.is_password_correct = async function (password: string) {
  if (!this.password) {
    return false;
  }
  return await Bun.password.verify(password, this.password);
};

// created a instance method for generating refresh_token
userSchema.methods.generate_refreshToken = function () {
  // using sign method of jwt for creating refresh_token
  return jwt.sign(
    {
      _id: this._id,
    },
    config.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRATION as any,
    }
  );
};

// Define indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ channelName: 1 });


// task: how it works
export const User = mongoose.model<
  IUser,
  mongoose.Model<IUser, {}, UserMethods>
>("User", userSchema);
