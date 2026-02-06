import mongoose, { Schema, Types } from "mongoose";

interface IHomeSection {
  sectionId: string; // Unique identifier for the section
  sectionKind: "single" | "multiple";
  title?: string;
  layout: "horizontal" | "vertical";
  contentReferences: Types.ObjectId[];
  contentType: "Video" | "Post" | "Playlist" | "Shorts";
}

// 1. Updated Interface
interface Ichannel {
  userId: Types.ObjectId;
  channelName: string;
  handleName: string;
  profilePicture: string;
  links: {
    _id: Types.ObjectId;
    logo?: string | null;
    name?: string | null;
    url?: string | null;
  }[];
  state: "active" | "suspended";
  bannerImage: string;
  description: string;
  isChannelSetup: boolean;
  stats: {
    subscriberCount: number; // Changed to number for consistency
    videoCount: number;
  };
  homeSections: IHomeSection[];
  createdAt: Date;
  updatedAt: Date;
}

const homeSectionSchema = new Schema<IHomeSection>(
  {
    sectionId: { type: String, required: true },
    sectionKind: {
      type: String,
      enum: ["single", "multiple"],
      required: true,
    },

    title: { type: String, default: null },
    layout: {
      type: String,
      enum: ["horizontal", "vertical"],
      default: "horizontal",
    },
    // This array holds the IDs
    contentReferences: {
      type: [
        {
          type: Schema.Types.ObjectId,
          refPath: "contentType", // Dynamic Reference!
        },
      ],
      validate: {
        validator: function (this, val: any[]) {
          const doc = this as IHomeSection;
          if (doc.sectionKind === "single") return val.length === 1;
          if (doc.sectionKind === "multiple") return val.length >= 1;
          return true;
        },
        message: "Items count does not match the section kind.",
      },
    },

    contentType: {
      type: String,
      required: true,
      enum: ["Video", "Post", "Playlist", "Shorts"],
      default: "Video",
    },
  },
  { _id: false },
);

const channelSchema = new Schema<Ichannel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channelName: { type: String, required: true },
    handleName: { type: String, required: true, unique: true, trim: true },
    profilePicture: { type: String, default: null },
    bannerImage: { type: String, default: null },
    description: { type: String, default: null },
    state: { type: String, enum: ["active", "suspended"], default: "active" },

    links: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, auto: true },
          logo: { type: String, default: null },
          name: { type: String, default: null },
          url: { type: String, default: null },
        },
      ],
      default: [],
      required: false,
    },

    homeSections: {
      type: [homeSectionSchema],
      validate: {
        validator: function (val: any[]) {
          return val.length <= 12;
        },
        message: "A channel can have a maximum of 12 featured sections.",
      },

      default: [],
      required: false,
    },

    isChannelSetup: { type: Boolean, default: false },
    stats: {
      subscriberCount: { type: Number, default: 0 },
      videoCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

channelSchema.index({ handleName: 1, createdAt: -1 });

export const Channel = mongoose.model<Ichannel>("Channel", channelSchema);