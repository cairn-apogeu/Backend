import { z } from 'zod';
import { DifficultyEnum } from './create-Cards.schema';

export const CardsUpdateSchema = z.object({
  titulo: z.string().max(100).optional(),
  descricao: z.string().optional(),
  status: z.string().max(20).optional(),
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
  computed: z.boolean().optional(),
  difficulty: DifficultyEnum.optional(),
  order: z.number().optional(),
});

export type CardsUpdateDto = z.infer<typeof CardsUpdateSchema>;
