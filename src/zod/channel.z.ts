import { z } from "zod";

export const channelCreate_z_data = z.object({
  channelName: z.string().min(3),
  handleName: z.string().min(3),
  profilePicture: z.string().url().optional(),
});

export const channelUpdate_z_data = z.object({
  channelName: z.string().min(3),
  handleName: z.string().min(3),
  profilePicture: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  discription: z.string().max(200).optional(),
});