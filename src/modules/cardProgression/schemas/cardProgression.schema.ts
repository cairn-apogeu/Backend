import { Status } from "@prisma/client";
import { z } from "zod";

export const CardProgressionSchema = z.object({
  card_id: z.number().int(),
  projeto_id: z.number().int().nullable().optional(),
  sprint_id: z.number().int().nullable().optional(),
  from_status: z.nativeEnum(Status),
  to_status: z.nativeEnum(Status),
  changed_at: z.coerce.date().optional(),
});

export const CardProgressionUpdateSchema = CardProgressionSchema.partial();

export type CardProgressionDto = z.infer<typeof CardProgressionSchema>;
export type CardProgressionUpdateDto = z.infer<
  typeof CardProgressionUpdateSchema
>;
