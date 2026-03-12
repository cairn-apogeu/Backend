// Schema for DevProjetos
import { z } from 'zod';

export const devProjetosSchema = z.object({
  projeto_id: z.number(),
  dev_id: z.string(),
});

export type DevProjetos = z.infer<typeof devProjetosSchema>;
