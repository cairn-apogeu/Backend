import { z } from 'zod';

export const ToScheduleWithPairingSchema = z.object({
    user_id: z.string(),
    paired_user_instagram: z.string(),
    datetime: z.string(),
});

export type ToScheduleWithPairingDto = z.infer<typeof ToScheduleWithPairingSchema>;