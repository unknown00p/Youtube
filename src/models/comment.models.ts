import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // indexed
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: { type: String, required: true },
    likes: { type: Number, default: null },

    // Metadata
    is_edited: { type: Boolean, default: false },

},
{ timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, created_at: -1}
commentSchema.index({ video_id: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
