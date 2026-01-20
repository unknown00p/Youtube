import { Subscription } from "../models/Subscription.model";
import { ApiError } from "../utils/errorHandler";

interface ISubscriptionData {
  subscriberId: string;
  channelId: string;
}

async function subscribeToChannel_service({
  subscriberId,
  channelId,
}: ISubscriptionData) {
  if (!subscriberId || !channelId) {
    throw new ApiError(400, "Both subscriberId and channelId are required");
  }

  const subscription = await Subscription.create({
    subscriberId,
    channelId,
  });

  if (!subscription) {
    throw new ApiError(500, "Failed to subscribe to channel");
  }

  return subscription;
}

async function unSubscribeToChannel_service({
  subscriberId,
  channelId,
}: ISubscriptionData) {
  if (!subscriberId || !channelId) {
    throw new ApiError(400, "Both subscriberId and channelId are required");
  }

  const unsubscribe = await Subscription.findOneAndDelete({
    subscriberId,
    channelId,
  });

  return unsubscribe;
}

export { subscribeToChannel_service, unSubscribeToChannel_service };
