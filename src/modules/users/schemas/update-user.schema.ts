import { z } from "zod";
import { ToUserSchema } from "./to-user.schema";

export const UpdateUserSchema = ToUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
