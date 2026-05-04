import { z } from "zod";

const optionalDate = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date(String(value));
}, z.date().optional());

export const UpdateSprintsSchema = z.object({
  id_projeto: z.number().int().positive().optional(),
  numero: z.number().int().positive().optional(),
  objetivo: z.string().nullable().optional(),
  computed: z.boolean().optional(),
  dia_inicio: optionalDate,
  dia_fim: optionalDate,
});

export type UpdateSprints = z.infer<typeof UpdateSprintsSchema>;
