import { z } from 'zod';

export const ToScheduleSchema = z.object({
    user_id: z.string(),
    datetime: z.string(),
});

export type ToScheduleDto = z.infer<typeof ToScheduleSchema>;