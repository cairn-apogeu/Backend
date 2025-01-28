import { z } from "zod";

export const ToSprintsSchema = z.object({
  id_projeto: z.number(),
  numero: z.number(),
  objetivo: z.string(),
  dia_inicio: z.date(),
  dia_fim: z.date(),
});

export type ToSprintsDto = z.infer<typeof ToSprintsSchema>;
