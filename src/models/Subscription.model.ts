import mongoose, { Schema, Types } from "mongoose";
import { ApiError } from "../utils/errorHandler";

interface ISubscription {
  subscriberId: Types.ObjectId;
  channelId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionDocument = mongoose.HydratedDocument<ISubscription>;

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // user who is subscribing
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // user being subscribed to
  },
  { timestamps: true }
);

// Pre-save hook to prevent self-subscription
subscriptionSchema.pre("validate", function (){
  if (this.subscriberId.equals(this.channelId)){
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
