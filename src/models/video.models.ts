import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String, // indexed, text search
  description: String, // text search
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, // indexed (shard key candidate)
  channel_id: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  }, // reference to user's channel

  // Media information
  video_url: String, // CDN URL
  thumbnail_url: String,
  duration: Number, // in seconds

  // Metadata
  tags: [String], // indexed
  category: String, // indexed
  language: String,

  // Privacy and status
  visibility: { enum: ["public", "private", "unlisted"], default: "public" }, // 'public', 'private', 'unlisted'
  status: { enum: ["processing", "published", "failed"], default: "processing" }, // 'processing', 'published', 'failed'

  // Engagement metrics (denormalized for performance)
  view_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  dislike_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },

  // Timestamps with TTL for unpublished videos
  published_at: Date, // indexed
  created_at: Date,
  updated_at: Date,

  // Video-specific settings
  monetization: {
    is_monetized: Boolean,
    ads_enabled: Boolean,
  },
});

// Define indexes
videoSchema.index({ owner_id: 1, published_at: -1 });
videoSchema.index({ category: 1, published_at: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ title: "text", description: "text" });

export const Video = mongoose.model("Video", videoSchema);
