import { Subscription } from "../models/Subscription.model";
import { ApiError } from "../utils/errorHandler";
import mongoose from "mongoose";

interface ISubscriptionData {
  subscriberId: string;
  channelId: string;
}

interface IGetSubscribedChannelsOfUser {
  userId: string;
  page: number;
  limit: number;
}

async function subscribeToChannel_service({
  subscriberId,
  channelId,
}: ISubscriptionData) {

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

async function getSubscribedChannelsOfUser_service({ userId, page, limit }:IGetSubscribedChannelsOfUser) {
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }
  const skip = (page - 1) * limit;

  // aggregation for multistep query wich helps working with foreign schema
  const subscribedChannels = await Subscription.aggregate([
    // finding all the channels that user have subscribed
    { $match: { subscriberId: userId } },

    // getting the all the channel's detail
    {
      $lookup: {
        from: "channels",
        foreignField: "_id",
        localField: "channelId",
        as: "channelData",
      },
    },

    // flating it to object
    { $unwind: "$channelData" },

    // selecting the neede feilds
    {
      $project: {
        _id: 0, // Exclude subscription _id
        channelId: "$channelData._id",
        channelName: "$channelData.channelName",
        handleName: "$channelData.handleName",
        profilePicture: "$channelData.profilePicture",
        discription: "$channelData.discription",
        subscriberCount: "$channelData.stats.subscriberCount",
      },
    },
  ]).skip(skip).limit(limit);

  return subscribedChannels;
}

export {
  subscribeToChannel_service,
  unSubscribeToChannel_service,
  getSubscribedChannelsOfUser_service,
};
