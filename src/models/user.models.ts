import mongoose, { Schema, type HydratedDocument } from "mongoose";

interface IUser {
  email: string;
  passwordHash?: string; // Optional based on auth providers
  googleId?: string;
  githubId?: string;
  username: string;
  channelName?: string;
  profilePicture?: string | null;
  bannerImage?: string | null;
  description?: string | null;
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

export type UserDocument = HydratedDocument<IUser>;

const passwordRequired = function (this: IUser): boolean {
  return !this.googleId && !this.githubId;
};

const userSchema = new Schema<IUser>(
  {
    // Required for ALL users (signup)
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    }, // indexed
    passwordHash: {
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

    channelName: {
      type: String,
      sparse: true, // Allow multiple nulls
      index: true,
    }, // indexed

    // Optional Profile Fields (set up later)
    profilePicture: {
      type: String,
      default: null, // for consistence feilds in database even its not given
    },
    bannerImage: { type: String, default: null },
    description: { type: String, default: null },

    // Channel Features
    isChannelSetup: { type: Boolean, default: false },

    // Stats
    stats: {
      subscriberCount: { type: Number, default: 0 },
      videoCount: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
    },
    channelSetupAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Define indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ channel_name: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
