import mongoose, { Schema, Types } from "mongoose";
import { ApiError } from "../utils/errorHandler";

interface ISubscription {
  subscriberChannelId: Types.ObjectId;
  targetChannelId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionDocument = mongoose.HydratedDocument<ISubscription>;

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriberChannelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    }, // user who is subscribing
    targetChannelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    }, // user being subscribed to
  },
  { timestamps: true }
);

// Pre-save hook to prevent self-subscription
subscriptionSchema.pre("validate", function (){
  if (this.subscriberChannelId.equals(this.targetChannelId)){
    throw new ApiError(400,"User cannot subscribe to themselves");
  }
})

// Define indexes
// {subscriberId: 1, channelId: 1}, unique: true
subscriptionSchema.index(
  // we are making a compound index
  { subscriberId: 1, channelId: 1 },

  // We are doing this so user can't subscribe the same channel multiple times
  { unique: true }
);

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
