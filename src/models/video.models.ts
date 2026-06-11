import mongoose, { Schema, Types } from "mongoose";

interface IVideo {
  title: string;
  description: string;
  isCommentEnabled: boolean;
  channel_id: Types.ObjectId;
  video_url: string;
  public_id: string;
  thumbnail_url: string;
  duration: number | null;
  tags: string[] | null;
  category: string;
  language: string | null;
  visibility: "public" | "private" | "unlisted";
  status: "processing" | "published" | "failed";
  view_count: number;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  createdAt: Date;
  updatedAt: Date;
}

export type VideoDocument = mongoose.HydratedDocument<IVideo>;

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true }, // indexed, text search
    description: { type: String, required: true }, // text search
    channel_id: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    }, // reference to user's channel

    // Media information
    video_url: { type: String, required: true }, // CDN URL
    thumbnail_url: { type: String, required: true },
    duration: { type: Number, default: null }, // in seconds

    public_id: { type: String, required: true }, // S3 file key for management

    // Metadata
    tags: { type: [String], default: null }, // indexed
    category: { type: String, required: true }, // indexed
    language: { type: String, default: null },

    // Privacy and status
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    }, // 'public', 'private', 'unlisted'
    status: {
      type: String,
      enum: ["processing", "published", "failed"],
      default: "processing",
    }, // 'processing', 'published', 'failed'

    isCommentEnabled: { type: Boolean, default: true },

    // Engagement metrics (denormalized for performance)
    view_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Define indexes
videoSchema.index({ channel_id: 1, createdAt: -1 });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ title: "text", description: "text" });

export const Video = mongoose.model<IVideo>("Video", videoSchema);
