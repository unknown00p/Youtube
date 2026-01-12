import * as z from "zod";

export const signup_z_data = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signin_z_data = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const getUserById_z_data = z.object({
  id: z.string().length(24),
});