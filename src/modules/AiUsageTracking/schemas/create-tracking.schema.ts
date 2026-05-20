import { z } from "zod";

export const CreateTrackingSchema = z.object({
  prompt: z.string().min(1, "O prompt é obrigatório"),
  acu_consumption_after_response: z.number().nullable().optional(),
});

export type CreateTrackingDto = z.infer<typeof CreateTrackingSchema>;
