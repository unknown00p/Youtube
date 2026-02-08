import mongoose, { Schema, type HydratedDocument } from "mongoose";

interface IComment {
  videoId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  likes: number | null;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentDocument = HydratedDocument<IComment>;

const commentSchema = new Schema<IComment>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // indexed
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, required: true },
    likes: { type: Number, default: null },

    // Metadata
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, created_at: -1}
commentSchema.index({ video_id: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
