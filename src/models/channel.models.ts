import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String, // channel name, indexed
  description: String,
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, // reference to user, indexed
  created_at: Date,
  updated_at: Date,

  // Denormalized counts for quick access
  subscriber_count: { type: Number, default: 0 },
  total_videos: { type: Number, default: 0 },
  total_views: { type: Number, default: 0 },

});

// Define indexes
channelSchema.index({ owner_id: 1 }, { name: "text" });

export const Channel = mongoose.model("Channel", channelSchema);
