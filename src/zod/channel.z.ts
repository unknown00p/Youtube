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

export const addSectionToFeaturedTab_z_data = z.object({
  sectionKind: z.enum(["single", "multiple"]),
  pinned: z.boolean().optional(),
  title: z.string().max(50).optional(),
  contentReferences: z.array(z.string()).min(1, "At least one content reference is required"),
  contentType: z.enum(["Video", "Post", "Playlist", "Shorts"]),
})

export const FeaturedTabSection_z_data = z.object({
  sectionKind: z.enum(["single", "multiple"]),
  contentReferences: z.string(),
  contentType: z.enum(["Video", "Post", "Playlist", "Shorts"]),
})

export const updateSectionTitle_z_data = z.object({
  title: z.string().max(50, "Title cannot exceed 50 characters"),
})