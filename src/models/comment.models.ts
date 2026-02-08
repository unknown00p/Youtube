import mongoose, { Schema, type HydratedDocument } from "mongoose";

interface IComment {
  videoId: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
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
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
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
commentSchema.index({ videoId: 1, channelId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
