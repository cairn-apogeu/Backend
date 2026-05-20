import { z } from "zod";

export const SyncDevinSessionsSchema = z.object({
  devin_api_key: z.string().min(1, "API key do Devin é obrigatória"),
  devin_org_id: z.string().min(1, "Org ID do Devin é obrigatório"),
  limit: z.number().int().min(1).max(200).optional(),
  created_after: z.number().int().optional(),
  created_before: z.number().int().optional(),
});

export type SyncDevinSessionsDto = z.infer<typeof SyncDevinSessionsSchema>;
