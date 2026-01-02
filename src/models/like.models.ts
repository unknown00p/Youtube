import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // compound index with user_id
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
    }, // 'like' or 'dislike'

    // Unique compound index to prevent duplicate reactions
    // Indexes: {video_id: 1, user_id: 1}, unique: true
  },
  { timestamps: true }
);

// Define indexes
likeSchema.index({ video_id: 1, createdAt: -1 });

export const Like = mongoose.model("Like", likeSchema);
