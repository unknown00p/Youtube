import { Subscription } from "../models/Subscription.model";
import { ApiError } from "../utils/errorHandler";
import mongoose from "mongoose";

interface ISubscriptionData {
  subscriberId: string;
  channelId: string;
}

interface IGetSubscribedChannelsOfUser {
  channelId: string;
  page: number;
  limit: number;
}

async function subscribeToChannel_service({
  subscriberId,
  channelId,
}: ISubscriptionData) {
  const subscription = await Subscription.create({
    subscriberChannelId: subscriberId,
    targetChannelId: channelId,
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
    subscriberChannelId: subscriberId,
    targetChannelId: channelId,
  });

  return unsubscribe;
}

async function getSubscribedChannelsOfUser_service({
  channelId,
  page,
  limit,
}: IGetSubscribedChannelsOfUser) {
  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }
  const skip = (page - 1) * limit;

  // aggregation for multistep query wich helps working with foreign schema
  const subscribedChannels = await Subscription.aggregate([
    // finding all the channels that user have subscribed
    { $match: { subscriberChannelId: channelId } },

    // getting the all the channel's detail
    {
      $lookup: {
        from: "channels",
        let: { channelIdVar: "$channelId" },

        // excluding the suspended channels
        pipeline: [
          {
            $match: {
              //allows you to use aggregation expressions within a query stage.
              $expr: {
                // allow multiple conditional oprations and retruns true if all the conditions are true
                $and: [
                  // match the channelId from subscription with _id of channel collection
                  {
                    // method to compare two feilds
                    $eq: ["$_id", "$$channelIdVar"],
                  },

                  // excluding suspended channels
                  { $eq: ["$status", "active"] },
                ],
              },
            },
          },
        ],
        as: "channelData",
      },
    },

    // flating it to object
    { $unwind: "$channelData" },

    // sorting the channels by createdAt date. from most recent one to oldest one
    { $sort: { createdAt: -1 } },

    { $skip: skip },
    { $limit: limit },

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
  ]);

  return subscribedChannels;
}

export {
  subscribeToChannel_service,
  unSubscribeToChannel_service,
  getSubscribedChannelsOfUser_service,
};
