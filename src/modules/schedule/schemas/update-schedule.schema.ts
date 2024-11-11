import { z } from 'zod';

export const UpdateScheduleSchema = z.object({
    datetime: z.string().optional(),
});

export type UpdateScheduleDto = z.infer<typeof UpdateScheduleSchema>;