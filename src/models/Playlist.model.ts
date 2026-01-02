import mongoose, { Schema } from "mongoose";

const PlaylistSchema = new Schema(
  {
    name: { type: String, required: true },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, // indexed
    visibility: { type: String, enum: ["public", "private", "unlisted"] }, // 'public', 'private', 'unlisted'

    // Video references with ordering
    videos: [
      {
        video_id: {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
        added_at: { type: Date, default: null },
        position: { type: Number, required: true },
      },
    ],

    video_count: { type: Number, default: 0 }, // denormalized count
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {owner_id: 1}, {videos.video_id: 1}
PlaylistSchema.index({ owner_id: 1 });
PlaylistSchema.index({ "videos.video_id": 1 });

export const Playlist = mongoose.model("Playlist", PlaylistSchema);
