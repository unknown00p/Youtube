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
  pinned?: boolean;
  sectionKind: "single" | "multiple";
  title?: string;
  contentReferences: string[];
  contentType: "Video" | "Post" | "Playlist" | "Shorts";
}

interface IRefrenceType {
  channelId: string;
  contentReferences: string[];
  contentType: "Video" | "Post" | "Playlist" | "Shorts";
}

interface IContentToSection {
  channelId: string;
  sectionId: string;
  contentReferences: string;
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
  } else if (contentType === "Playlist") {
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
  } else if (contentType === "Post") {
    // Currently we don't have a Post model, but if we did, we would implement similar validation logic here to ensure that the referenced posts exist and belong to the channel.
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

async function getProfileOfChannel_service(channelId: string) {
  const channel = await Channel.findById(channelId).select(
    "userId channelName handleName profilePicture bannerImage description links stats",
  );

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

async function getPlaylistsOfChannel_service({
  channelId,
  page,
  limit,
}: IGetVideosOfChannel) {
  const playlists = await Playlist.find({ channel_id: channelId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (playlists.length === 0) {
    throw new ApiError(404, "No playlists found for this channel");
  }

  return playlists;
}

async function addSectionToFeaturedTab_service({
  channelId,
  pinned,
  sectionKind,
  title,
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
          pinned,
          sectionKind,
          title,
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

async function addContentToSection_service({
  channelId,
  sectionId,
  contentReferences,
  contentType,
}: IContentToSection) {
  const contentReferencesArr = [contentReferences];

  await validateContentRefrenceType({
    channelId,
    contentReferences: contentReferencesArr,
    contentType,
  });

  const section = await Channel.findOneAndUpdate(
    {
      _id: channelId,
      "homeSections.sectionId": sectionId,
    },
    {
      // Using $addToSet to prevent duplicate entries in contentReferences
      $addToSet: {
        // we using $ to reach the saved section in homeSections array and add contentReferences to it
        "homeSections.$.contentReferences": {
          // adding each content refrence one by one $each prevent adding whole array as a single element in contentReferences array
          $each: contentReferences,
        },
      },
    },
    { new: true },
  );

  if (!section) {
    throw new ApiError(500, "got error while adding content to section");
  }

  return section;
}

async function removeContentOfSection_service({
  channelId,
  sectionId,
  contentReferences,
  contentType,
}: IContentToSection) {
  const contentReferencesArr = [contentReferences];

  await validateContentRefrenceType({
    channelId,
    contentReferences: contentReferencesArr,
    contentType,
  });

  const section = await Channel.findOneAndUpdate(
    {
      _id: channelId,
      "homeSections.sectionId": sectionId,
    },
    {
      // Using $pull to remove contentReferences from the section
      $pull: {
        // we using $ to reach the saved section in homeSections array and remove contentReferences from it
        "homeSections.$.contentReferences": {
          // removing each content refrence one by one $in operator is used to remove all the contentReferences that match any value in the contentReferences array
          $in: contentReferences,
        },
      },
    },
    { new: true },
  );

  if (!section) {
    throw new ApiError(500, "got error while removing content from section");
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

async function updateSectionTitle_service(
  channelId: string,
  sectionId: string,
  title: string,
) {
  const section = await Channel.findOneAndUpdate(
    {
      _id: channelId,
      "homeSections.sectionId": sectionId,
    },
    {
      $set: {
        "homeSections.$.title": title,
      },
    },
    { new: true },
  );

  if (!section) {
    throw new ApiError(404, "got error while updating section title");
  }

  return section;
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
  getProfileOfChannel_service,
  getVideosOfChannel_service,
  getPlaylistsOfChannel_service,
  getHomeOfChannel_service,
  addSectionToFeaturedTab_service,
  addContentToSection_service,
  removeContentOfSection_service,
  updateSectionTitle_service
};