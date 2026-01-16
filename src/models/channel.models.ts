import mongoose, { Schema, Types } from "mongoose";

interface Ichannel {
  channelName: string;
  handleName: string;
  profilePicture: string; // nullable for anonymous users
  bannerImage: string; // seconds watched
  bio: string; // seconds watched
  isChannelSetup: boolean; // seconds watched
  stats: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelDocument = mongoose.HydratedDocument<Ichannel>;

const channelSchema = new Schema<Ichannel>(
  {
    channelName: {
      type: String,
      required:true
    },

    handleName: {
      type: String,
      requred: true
    },

    // Optional Profile Fields (set up later)
    profilePicture: {
      type: String,
      default: null, // for consistence feilds in database even its not given
    },

    bannerImage: { type: String, default: null },
    bio: { type: String, default: null },

    // Channel Features
    isChannelSetup: { type: Boolean, default: false },

    // Stats
    stats: {
      subscriberCount: { type: Number, default: 0 },
      videoCount: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, createdAt: -1},
channelSchema.index({ handleName: 1, createdAt: -1 });

export const Views = mongoose.model<Ichannel>("Views", channelSchema);
