import { z } from "zod";

export const CreateTrackingSchema = z.object({
  prompt: z.string().min(1, "O prompt é obrigatório"),
  devin_response: z.string().nullable().optional(),
  devin_session_id: z.string().nullable().optional(),
  acu_consumption_after_response: z.number().nullable().optional(),
});

export type CreateTrackingDto = z.infer<typeof CreateTrackingSchema>;
