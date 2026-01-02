import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
  subscriber_id: {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },   // user who is subscribing
  channel_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },     // user being subscribed to
},
{ timestamps: true }
);

// Define indexes
// {subscriber_id: 1, channel_id: 1}, unique: true
subscriptionSchema.index({subscriber_id: 1, channel_id: 1});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
