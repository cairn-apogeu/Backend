import { z } from 'zod';

export const ScheduleIdSchema = z.object({
    id: z.string(),
});

export type ScheduleIdDto = z.infer<typeof ScheduleIdSchema>;