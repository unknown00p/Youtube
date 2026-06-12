import { z } from "zod";

// 1. Define Enums as Zod Enums first
export const VideoVisibility_z_data = z.enum(["public", "private", "unlisted"]);
export const VideoStatus_z_data = z.enum(["processing", "published", "failed"]);

// 2. Define the main validation schema
export const UploadVideo_z_data = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .trim(),
  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .default(""),
  video_url: z.string().url("Invalid video URL format"),
  // s3FileKey: z.string().min(1, "S3 file key is required"),
  thumbnail_url: z.string().url("Invalid thumbnail URL format"),
  duration: z.number().positive("Duration must be a positive number"),
  public_id: z.string().trim(),

  tags: z
    .array(z.string().trim())
    .min(1, "At least one tag is required")
    .max(20, "Too many tags"),
  category: z.string().min(1, "Category is required"),
  language: z
    .string()
    .length(2, "Use 2-letter ISO codes (e.g., 'en')")
    .default("en"),

  visibility: VideoVisibility_z_data.default("public"),
  status: VideoStatus_z_data.default("processing"),
});

export const UpdateVideo_z_data = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .trim(),
  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .default(""),

  videoid: z.string().max(50)
});
