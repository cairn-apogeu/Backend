import { z } from 'zod';

export const UserIdSchema = z.object({
    userId: z.string(),
});

export type UserIdDto = z.infer<typeof UserIdSchema>;