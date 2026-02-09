import mongoose, { Schema, Types } from "mongoose";

interface IWatchHistory {
  user_id: Types.ObjectId;
  video_id: Types.ObjectId;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WatchHistoryDocument = mongoose.HydratedDocument<IWatchHistory>;

const watchHistorySchema = new Schema<IWatchHistory>(
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

export const WatchHistory = mongoose.model<IWatchHistory>("WatchHistory", watchHistorySchema);
