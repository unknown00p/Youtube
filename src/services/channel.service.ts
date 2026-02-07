import mongoose from "mongoose";
import { Channel } from "../models/channel.models";
import { ApiError } from "../utils/errorHandler";
import { Video } from "../models/video.models";
import { v4 as uuid } from "uuid";
import { Playlist } from "../models/Playlist.model";

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
  description?: string;
}

interface IGetVideosOfChannel {
  channelId: string;
  page: number;
  limit: number;
}

interface IAddSectionToFeaturedTab {
  channelId: string;
  sectionKind: "single" | "multiple";
  title?: string;
  layout: "horizontal" | "vertical";
  contentReferences: string[];
  contentType: "Video" | "Post" | "Playlist" | "Shorts";
}

interface IRefrenceType {
  channelId: string;
  contentReferences: string[];
  contentType: "Video" | "Post" | "Playlist" | "Shorts";
}

const validateContentRefrenceType = async ({
  channelId,
  contentReferences,
  contentType,
}: IRefrenceType) => {
  // find if there is any duplicate id's in refrenceArray
  // create a new array with removed duplicated id's
  const uniqueIds = new Set(contentReferences);

  // check if there is any duplicate in orignal array
  if (uniqueIds.size !== contentReferences.length) {
    throw new ApiError(400, "Please remove the duplicate video");
  }

  if (contentType === "Video") {
    const videos = await Video.find({
      _id: { $in: contentReferences },
      channel_id: channelId,
      visibility: "public",
    });

    if (contentReferences.length !== videos.length) {
      throw new ApiError(
        400,
        "One or more content references are invalid or not accessible",
      );
    }
  } else if (contentType === "Post") {
    // Currently we don't have a Post model, but if we did, we would implement similar validation logic here to ensure that the referenced posts exist and belong to the channel.
  } else if (contentType === "Playlist") {
    // Handle Playlist content type validation if needed
    const playlists = await Playlist.find({
      _id: { $in: contentReferences },
      owner_id: channelId,
      visibility: "public",
    });

    if (contentReferences.length !== playlists.length) {
      throw new ApiError(
        400,
        `One or more content references are invalid or not accessible`,
      );
    }
  } else if (contentType === "Shorts") {
    // Currently we don't have a Shorts model, but if we did, we would implement similar validation logic here to ensure that the referenced shorts exist and belong to the channel.
  }

  return true;
};

async function createChannelProfile_service({
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

async function updateChannelProfile_service(
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

async function getProfileOfChannelById_service(channelId: string) {
  const channel = await Channel.findById(channelId).select("userId channelName handleName profilePicture bannerImage description links stats");

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  return channel;
}

async function getVideosOfChannel_service({
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

async function addSectionToFeaturedTab_service({
  channelId,
  sectionKind,
  title,
  layout,
  contentReferences,
  contentType,
}: IAddSectionToFeaturedTab) {
  const sectionId = uuid();

  await validateContentRefrenceType({
    channelId,
    contentReferences,
    contentType,
  });

  const section = await Channel.findByIdAndUpdate(
    {
      _id: channelId,
      "homeSections.11": { $exists: false },
    },
    {
      $push: {
        homeSections: {
          sectionId,
          sectionKind,
          title,
          layout,
          contentReferences,
          contentType,
        },
      },
    },
    { new: true, runValidators: true },
  );

  if (!section) {
    throw new ApiError(500, "got error while adding section to featured tab");
  }

  return section;
}

async function getHomeOfChannel_service(channelId: string) {
  const homeSection = await Channel.findById(channelId).select("homeSections");

  if (!homeSection) {
    throw new ApiError(404, "Channel not found");
  }

  return homeSection;
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
  createChannelProfile_service,
  updateChannelProfile_service,
  getProfileOfChannelById_service,
  getVideosOfChannel_service,
  addSectionToFeaturedTab_service,
  getHomeOfChannel_service
};
