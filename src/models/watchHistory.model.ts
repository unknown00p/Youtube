import mongoose, { Schema } from "mongoose";

const watchHistorySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, // shard key candidate
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    progress: { type: Number, default: 0 }, // last watched position in seconds
    // duration: { type: Number, default: 0 },
},
{ timestamps: true }
);

// Define indexes
// Indexes: {user_id: 1, watched_at: -1}
watchHistorySchema.index({ user_id: 1 });

// TTL: {watched_at: 1}, expireAfterSeconds: 7776000 (90 days)
watchHistorySchema.index({ createdAd: -1 }, { expireAfterSeconds: 7776000 });

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
