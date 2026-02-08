import mongoose, { Schema, Types } from "mongoose";

export type ReactionType = "like" | "dislike";
export type TargetType = "Video" | "Comment";

export interface ILike {
  targetId:Types.ObjectId;
  video_id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: ReactionType;
  targetType: TargetType;
  createdAt: Date;
  updatedAt: Date;
}

export type LikeDocument = mongoose.HydratedDocument<ILike>;

const likeSchema = new Schema<ILike>(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "TargetType",
    }, // compound index with user_id
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like","dislike"]
    }, // 'like' or 'dislike'

    targetType:{
      type: String,
      enum: ["Video","Comment"]
    }

    // Unique compound index to prevent duplicate reactions
    // Indexes: {video_id: 1, user_id: 1}, unique: true
  },
  { timestamps: true }
);

// Define indexes
likeSchema.index({ video_id: 1, createdAt: -1 });

export const Like = mongoose.model<ILike>("Like", likeSchema);
