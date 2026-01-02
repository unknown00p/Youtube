import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String, // indexed, unique
  email: String, // indexed, unique
  profile_picture: String,
  channel_name: String, // indexed
  channel_description: String,
  subscriber_count: Number, // periodically updated from subscriptions collection
  created_at: Date,
  updated_at: Date,
});

// Define indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ channel_name: 1 });

export const User = mongoose.model("User", userSchema);