import { z } from "zod";

export const ProjetosParamsIdSchema = z.object({
  id: z.string(),
});

export type ProjetosParamsIdDto = z.infer<typeof ProjetosParamsIdSchema>;
