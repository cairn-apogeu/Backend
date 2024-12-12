import { z } from "zod";

export const ToSprintsSchema = z.object({
  id_projeto: z.number(),
  numero: z.number(),
});

export type ToSprintsDto = z.infer<typeof ToSprintsSchema>;
