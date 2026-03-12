import { z } from "zod";

const indicadoresSchema = {
  ajudas_prestadas: z.number().nullable().optional(),
  sinalizacao_risco_tecnico_integracao: z.number().nullable().optional(),
  compartilhamento_solucoes: z.number().nullable().optional(),
  participacao_feedbacks: z.number().nullable().optional(),
};

export const ContribuicaoSistemicaSchema = z.object({
  user_id: z.string(),
  sprint_id: z.number().int(),
  daily_id: z.number().int().nullable().optional(),
  ...indicadoresSchema,
});

export const ContribuicaoSistemicaUpdateSchema =
  ContribuicaoSistemicaSchema.partial();

export type ContribuicaoSistemicaDto = z.infer<
  typeof ContribuicaoSistemicaSchema
>;
export type ContribuicaoSistemicaUpdateDto = z.infer<
  typeof ContribuicaoSistemicaUpdateSchema
>;
