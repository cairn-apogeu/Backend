import { z } from "zod";

const indicadoresSchema = {
  validacao_entendimento_pre_execucao: z.number().nullable().optional(),
  clareza_exposicao_tecnica: z.number().nullable().optional(),
  participacao_discussoes_tecnicas: z.number().nullable().optional(),
  sinalizacao_desalinhamento_ruido: z.number().nullable().optional(),
};

export const ComunicacaoOperacionalSchema = z.object({
  user_id: z.string(),
  sprint_id: z.number().int(),
  daily_id: z.number().int().nullable().optional(),
  ...indicadoresSchema,
});

export const ComunicacaoOperacionalUpdateSchema =
  ComunicacaoOperacionalSchema.partial();

export type ComunicacaoOperacionalDto = z.infer<
  typeof ComunicacaoOperacionalSchema
>;
export type ComunicacaoOperacionalUpdateDto = z.infer<
  typeof ComunicacaoOperacionalUpdateSchema
>;
