import mongoose, { Schema, Types } from "mongoose";

interface Ichannel {
  channelName: string;
  handleName: string;
  profilePicture: string; // nullable for anonymous users
  links: {
    logo: string;
    name: string;
    url: string;
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
    discription: { type: String, default: null },

    links: {
      type: [
        {
          logo: { type: String, default: null },
          name: { type: String, default: null },
          url: { type: String, default: null }
        }
      ],
      default: []
    },

    // Channel Features
    isChannelSetup: { type: Boolean, default: false },

    // Stats
    stats: {
      subscriberCount: { type: Number, default: 0 },
      videoCount: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, createdAt: -1},
channelSchema.index({ handleName: 1, createdAt: -1 });

export const Channel = mongoose.model<Ichannel>("Channel", channelSchema);