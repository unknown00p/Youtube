import mongoose, { Schema } from "mongoose";

const viewsSchema = new Schema(
  {
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // indexed
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, // nullable for anonymous users
    watch_time: Number, // seconds watched
    device_info: {
      platform: String,
      browser: String,
    },
},
{ timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, createdAt: -1},
viewsSchema.index({ video_id: 1, createdAt: -1 });

//  {user_id: 1, video_id: 1}
viewsSchema.index({ user_id: 1, video_id: 1 });

// TTL index: {createdAt: 1}, expireAfterSeconds: 7776000 (90 days)
viewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const Views = mongoose.model("Views", viewsSchema);
