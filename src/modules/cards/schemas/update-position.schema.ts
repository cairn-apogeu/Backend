import { z } from "zod";

export const UpdatePositionSchema = z.object({
  status: z.string(),
});

export type UpdatePositionDto = z.infer<typeof UpdatePositionSchema>;
