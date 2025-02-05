import { z } from "zod";

export const UpdateSprintsSchema = z.object({
  id_projeto: z.number().optional(),
  numero: z.number().optional(),
  objetivo: z.string().optional(),
  dia_inicio: z.date().optional(),
  dia_fim: z.date().optional(),
});

export type UpdateSprints = z.infer<typeof UpdateSprintsSchema>;
