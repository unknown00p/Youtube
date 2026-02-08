import z from "zod";

export const comment_z_data = z.object({
  content: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "Content is required")
        .max(500, "Content must be less than 500 characters"),
    ),
});
