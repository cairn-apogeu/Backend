import { z } from "zod";

const presencaSchema = z.object({
  dev_id: z.string(),
  presente: z.boolean().optional(),
});

export const DailySchema = z.object({
  projeto_id: z.number().int(),
  sprint_id: z.number().int(),
  conteudo: z.string().min(1),
  criado_em: z.coerce.date().optional(),
  presencas: z.array(presencaSchema).optional(),
});

export const DailyUpdateSchema = DailySchema.partial();

export type DailyDto = z.infer<typeof DailySchema>;
export type DailyUpdateDto = z.infer<typeof DailyUpdateSchema>;
