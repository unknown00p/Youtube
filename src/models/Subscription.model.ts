import mongoose, { Schema, Types } from "mongoose";

interface ISubscription {
  subscriber_id: Types.ObjectId;
  channel_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionDocument = mongoose.HydratedDocument<ISubscription>;

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // user who is subscribing
    channel_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // user being subscribed to
  },
  { timestamps: true }
);

// Define indexes
// {subscriber_id: 1, channel_id: 1}, unique: true
subscriptionSchema.index({ subscriber_id: 1, channel_id: 1 });

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
