import mongoose from "mongoose";
import { Channel } from "../models/channel.models";
import { ApiError } from "../utils/errorHandler";
import { Video } from "../models/video.models";

interface ICreateChannel {
  userId: string;
  channelName: string;
  handleName: string;
  profilePicture?: string;
}

interface IUpdateChannel {
  channelName: string;
  handleName: string;
  profilePicture?: string;
  bannerImage?: string;
  discription?: string;
}

interface IGetVideosOfChannel {
  channelId: string;
  page: number;
  limit: number;
}

async function createChannel_service({
  userId,
  channelName,
  handleName,
  profilePicture,
}: ICreateChannel) {
  // Implementation for creating a channel
  const channel = await Channel.create({
    userId,
    channelName,
    handleName,
    profilePicture,
  });

  if (!channel) {
    throw new ApiError(500, "Failed to create channel");
  }

  return channel;
}

async function updateChannel_service(
  channelId: string,
  updateData: Partial<IUpdateChannel>,
) {
  const channel = await Channel.findByIdAndUpdate(
    channelId,
    {
      $set: updateData,
    },
    { new: true },
  );

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  return channel;
}

async function getChannelById_service(channelId: string) {
  const channel = await Channel.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  return channel;
}

async function getVideosOfChannel({
  channelId,
  page,
  limit,
}: IGetVideosOfChannel) {
  const videos = await Video.find({ channel_id: channelId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (videos.length === 0) {
    throw new ApiError(404, "No videos found for this channel");
  }

  return videos;
}

// async function deleteChannel_service(channelId: string) {
//   // Implementation for deleting a channel
//   if (!channelId) {
//     throw new ApiError(400, "Channel ID is required");
//   }

//   const channel = await Channel.findByIdAndDelete(channelId);

//   if (!channel) {
//     throw new ApiError(404, "Channel not found");
//   }

//   return channel;
// }

export {
  createChannel_service,
  updateChannel_service,
  getChannelById_service,
  getVideosOfChannel,
};
