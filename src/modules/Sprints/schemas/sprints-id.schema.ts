import { z } from "zod";

export const SprintsIdSchema = z.object({
  id: z.number(),
});

export type SprintsIdDto = z.infer<typeof SprintsIdSchema>;
