import mongoose, { Schema, type HydratedDocument } from "mongoose";

interface IComment {
  video_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  text: string;
  likes: number | null;
  is_edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentDocument = HydratedDocument<IComment>;

const commentSchema = new Schema<IComment>(
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

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
