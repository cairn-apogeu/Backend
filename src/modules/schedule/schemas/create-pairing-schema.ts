import { z } from 'zod';

export const CreatePairingSchema = z.object({
    primary_user_id: z.string(),
    paired_user_id: z.string(),
    schedule_id: z.string(),
});

export type CreatePairingDto = z.infer<typeof CreatePairingSchema>;