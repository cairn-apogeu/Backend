import { z } from "zod";

const indicadoresSchema = {
  delta_time_predict: z.number().nullable().optional(),
  reestimativa_ativa: z.number().nullable().optional(),
  estabilidade_throughput: z.number().nullable().optional(),
  sinalizacao_bloqueios: z.number().nullable().optional(),
  qualidade_cards_dor: z.number().nullable().optional(),
  aderencia_entregas_dod: z.number().nullable().optional(),
};

export const ExecucaoConfiavelSchema = z.object({
  user_id: z.string(),
  sprint_id: z.number().int(),
  daily_id: z.number().int().nullable().optional(),
  ...indicadoresSchema,
});

export const ExecucaoConfiavelUpdateSchema =
  ExecucaoConfiavelSchema.partial();

export type ExecucaoConfiavelDto = z.infer<typeof ExecucaoConfiavelSchema>;
export type ExecucaoConfiavelUpdateDto = z.infer<
  typeof ExecucaoConfiavelUpdateSchema
>;
