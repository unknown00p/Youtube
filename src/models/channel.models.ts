import mongoose, { Schema, Types } from "mongoose";

interface Ichannel {
  userId: Types.ObjectId; // Reference to User model
  channelName: string;
  handleName: string;
  profilePicture: string; // nullable for anonymous users
  links: {
    _id: Types.ObjectId;
    logo?: string | null;
    name?: string | null;
    url?: string | null;
  }[];
  bannerImage: string; // seconds watched
  discription: string; // seconds watched
  isChannelSetup: boolean; // seconds watched
  stats: {
    subscriberCount: string;
    videoCount: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelDocument = mongoose.HydratedDocument<Ichannel>;

const channelSchema = new Schema<Ichannel>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    channelName: {
      type: String,
      required: true,
    },

    handleName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Optional Profile Fields (set up later)
    profilePicture: {
      type: String,
      default: null, // for consistence feilds in database even its not given
    },

    bannerImage: { type: String, default: null },
    discription: { type: String, default: null },

    links: {
      type: [
        {
          // for future task to edit and delete links we can use this _id for effecient query operations
          _id: { type: Types.ObjectId, auto: true },
          logo: { type: String, default: null },
          name: { type: String, default: null },
          url: {
            type: String,
            default: null,
            match: [/^https?:\/\/.+/, "Invalid URL"],
          },
        },
      ],
      default: [],
    },

    // Channel Features
    isChannelSetup: { type: Boolean, default: false },

    // Stats
    stats: {
      subscriberCount: { type: Number, default: 0 },
      videoCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, createdAt: -1},
channelSchema.index({ handleName: 1, createdAt: -1 });

export const Channel = mongoose.model<Ichannel>("Channel", channelSchema);