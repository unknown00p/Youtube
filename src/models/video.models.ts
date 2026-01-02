import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
  title: { type: String, required: true }, // indexed, text search
  description: { type: String, required: true }, // text search
  channel_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, // reference to user's channel

  // Media information
  video_url: { type: String, required: true }, // CDN URL
  thumbnail_url: { type: String, required: true },
  duration: { type: Number, default: null }, // in seconds

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

  // Engagement metrics (denormalized for performance)
  view_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  dislike_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },

  // Timestamps with TTL for unpublished videos
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Define indexes
videoSchema.index({ channel_id: 1, created_at: -1 });
videoSchema.index({ category: 1, created_at: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ title: "text", description: "text" });

export const Video = mongoose.model("Video", videoSchema);
