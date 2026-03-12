import { z } from "zod";

const indicadoresSchema = {
  reformulacao_problema: z.number().nullable().optional(),
  separacao_sintoma_causa: z.number().nullable().optional(),
  autocritica_tecnica: z.number().nullable().optional(),
  escolha_abordagens_tecnicas: z.number().nullable().optional(),
};

export const CapacidadeCognitivaAplicadaSchema = z.object({
  user_id: z.string(),
  sprint_id: z.number().int(),
  daily_id: z.number().int().nullable().optional(),
  ...indicadoresSchema,
});

export const CapacidadeCognitivaAplicadaUpdateSchema =
  CapacidadeCognitivaAplicadaSchema.partial();

export type CapacidadeCognitivaAplicadaDto = z.infer<
  typeof CapacidadeCognitivaAplicadaSchema
>;
export type CapacidadeCognitivaAplicadaUpdateDto = z.infer<
  typeof CapacidadeCognitivaAplicadaUpdateSchema
>;
