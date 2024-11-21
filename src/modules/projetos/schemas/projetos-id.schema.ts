import { z } from "zod";

export const ProjetosIdSchema = z.object({
  id: z.number(),
});

export type ProjetosIdDto = z.infer<typeof ProjetosIdSchema>;
