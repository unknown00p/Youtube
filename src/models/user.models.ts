import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  // Required for ALL users (signup)
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // indexed
  passwordHash: { 
    type: String, 
    required: function() {
      // Only required if not using OAuth
      return !this.googleId && !this.githubId;
    } 
  },
  
  // Auth providers (optional)
  googleId: { type: String, sparse: true },
  githubId: { type: String, sparse: true },
  
  // Required for ALL users but with defaults
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // indexed

  channelName: { 
    type: String,
    sparse: true, // Allow multiple nulls
    index: true 
  }, // indexed
  
  // Optional Profile Fields (set up later)
  profilePicture: { type: String, default: null },
  bannerImage: { type: String, default: null },
  description: { type: String, default: null },
  
  // Channel Features
  isChannelSetup: { type: Boolean, default: false },
  
  // Stats
  stats: {
    subscriberCount: { type: Number, default: 0 },
    videoCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  channelSetupAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now }
});

// Define indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ channel_name: 1 });

export const User = mongoose.model("User", userSchema);