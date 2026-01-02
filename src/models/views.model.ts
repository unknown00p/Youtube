import mongoose, { Schema } from "mongoose";

const viewsSchema = new Schema({
  video_id: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  }, // indexed
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, // nullable for anonymous users
  watch_time: {type:Number, default: null}, // seconds watched
//   device_info: {
//     platform: String,
//     browser: String,
//   },
  created_at: Date, // indexed, TTL index for retention

  // Indexes: {video_id: 1, created_at: -1}, {user_id: 1, video_id: 1}
  // TTL index: {created_at: 1}, expireAfterSeconds: 7776000 (90 days)
});

// Define indexes
viewsSchema.index({ video_id: 1, created_at: -1 });
viewsSchema.index({ user_id: 1, video_id: 1 });
viewsSchema.index({ created_at: 1 }, { expireAfterSeconds: 7776000 });

export const Views = mongoose.model("Views", viewsSchema);
