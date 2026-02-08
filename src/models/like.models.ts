import mongoose, { Schema, Types } from "mongoose";

export type ReactionType = "like" | "dislike";

export interface ILike {
  videoId: Types.ObjectId;
  channelId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LikeDocument = mongoose.HydratedDocument<ILike>;

const likeSchema = new Schema<ILike>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // compound index with user_id
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    }
    // Unique compound index to prevent duplicate reactions
    // Indexes: {video_id: 1, user_id: 1}, unique: true
  },
  { timestamps: true }
);

// Define indexes
likeSchema.index({ videoId: 1, createdAt: -1 });

export const Like = mongoose.model<ILike>("Like", likeSchema);