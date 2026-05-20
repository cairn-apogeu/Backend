import { z } from "zod";

export const UpdateTrackingSchema = z.object({
  acu_consumption_after_response: z.number().nullable().optional(),
});

export type UpdateTrackingDto = z.infer<typeof UpdateTrackingSchema>;
