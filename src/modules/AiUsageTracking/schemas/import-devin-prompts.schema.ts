import { z } from "zod";

export const ImportDevinPromptsSchema = z.object({
  devin_api_key: z.string().min(1, "API key do Devin é obrigatória"),
  devin_org_id: z.string().min(1, "Org ID do Devin é obrigatório"),
  session_id: z.string().min(1, "Session ID é obrigatório"),
  acus_consumed: z.number().nullable().optional(),
});

export type ImportDevinPromptsDto = z.infer<typeof ImportDevinPromptsSchema>;
