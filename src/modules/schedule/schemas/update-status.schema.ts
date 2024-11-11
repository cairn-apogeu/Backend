import { z } from 'zod';

export const UpdateStatusParams = z.object({
    id: z.string(),
    userId: z.string(),
});
export enum SCHEDULE_STATUS {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
}
export const UpdateStatusBody = z.object({
    status: z.nativeEnum(SCHEDULE_STATUS),
});

export type UpdateStatusBodyDto = z.infer<typeof UpdateStatusBody>;

