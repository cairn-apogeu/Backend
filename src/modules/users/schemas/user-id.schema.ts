import { z } from "zod";

export const UserIdSchema = z.object({
  id: z.string(),
});

export type UserIdDto = z.infer<typeof UserIdSchema>;
