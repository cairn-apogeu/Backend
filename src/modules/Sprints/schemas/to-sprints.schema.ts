import { z } from "zod";

export const ToSprintsSchema = z.object({
  id_projeto: z.number(),
  numero: z.number(),
  objetivo: z.string(),
  dia_inicio: z.string().transform((val) => new Date(val)),
  dia_fim: z.string().transform((val) => new Date(val)),
});

export type ToSprintsDto = z.infer<typeof ToSprintsSchema>;
