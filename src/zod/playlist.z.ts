import z from "zod";

export const playlist_z_data = z.object({
    name: z.string().min(1, "Playlist name is required"),
    visibility: z.enum(["public", "private"]),
    position: z.number().int().nonnegative("Position must be a non-negative integer"),
})