import { z } from "zod";

const linkSchema = z.object({
  logo: z.string().url().optional(),
  name: z.string().min(1, "Link name required"),
  url: z.string().url("Invalid URL"),
});

export const channel_z_data = z.object({
  channelName: z.string().min(3),
  handleName: z.string().min(3),
  profilePicture: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  discription: z.string().max(500).optional(),
  links: z.array(linkSchema).max(10).optional(), // limit links
});
