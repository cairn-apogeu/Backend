import { z } from "zod";

export const CardsIdSchema = z.object({
  id: z.number(),
});

export type CardsIdDto = z.infer<typeof CardsIdSchema>;
