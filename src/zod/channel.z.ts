import { z } from "zod";

export const channelCreate_z_data = z.object({
  channelName: z.string().min(3, "Channel name must be at least 3 characters").max(25, "Channel name cannot exceed 25 characters"),
  handleName: z.string().min(3).max(20, "Handle name cannot exceed 20 characters"),
  profilePicture: z.string().url().optional(),
});

export const channelUpdate_z_data = z.object({
  channelName: z.string().min(3, "Channel name must be at least 3 characters").max(25, "Channel name cannot exceed 25 characters"),
  handleName: z.string().min(3).max(20, "Handle name cannot exceed 20 characters"),
  profilePicture: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  discription: z.string().max(200).optional(),
});