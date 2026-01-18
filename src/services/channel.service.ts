import { Channel } from "../models/channel.models";
import { ApiError } from "../utils/errorHandler";

interface ICreateChannel {
  userId: string;
  channelName: string;
  handleName: string;
  profilePicture?: string;
  bannerImage?: string;
  discription?: string;
  links?: {
    logo?: string;
    name?: string;
    url?: string;
  }[];
}

export async function createChannel_service({
  userId,
  channelName,
  handleName,
  profilePicture,
  bannerImage,
  discription,
  links,
}: ICreateChannel) {
  // Implementation for creating a channel

  const channel = await Channel.create({
    userId,
    channelName,
    handleName,
    profilePicture,
    bannerImage,
    discription,
    links:
      links?.map((link) => ({
        logo: link.logo,
        name: link.name,
        url: link.url,
      })) || [],
  });

  if (!channel) {
    throw new ApiError(500, "Failed to create channel");
  }

  return channel;
}
