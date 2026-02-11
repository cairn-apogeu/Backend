import { z } from 'zod';

export const DifficultyEnum = z.enum([
  "MUITO_FACIL",
  "FACIL",
  "MEDIO",
  "DIFICIL",
  "MUITO_DIFICIL"
]);

export const CardsSchema = z.object({
  titulo: z.string().max(100),
  descricao: z.string().optional(),
  status: z.string().max(20),
  tempo_estimado: z.number().optional(),
  tempo: z.number().optional(),
  assigned: z.string().optional(),
  sprint: z.number().optional(),
  dod: z.string().optional(),
  dor: z.string().optional(),
  xp_frontend: z.boolean().optional(),
  xp_backend: z.boolean().optional(),
  xp_negocios: z.boolean().optional(),
  xp_arquitetura: z.boolean().optional(),
  xp_design: z.boolean().optional(),
  xp_datalytics: z.boolean().optional(),
  indicacao_conteudo: z.string().optional(),
  projeto: z.number().optional(),
  computed: z.boolean().optional(),
  difficulty: DifficultyEnum.optional(),
  order: z.number().optional(),
});

export type CardsDto = z.infer<typeof CardsSchema>;


