import { z } from 'zod';

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
  xp_frontend: z.number().optional(),
  xp_backend: z.number().optional(),
  xp_negocios: z.number().optional(),
  xp_arquitetura: z.number().optional(),
  xp_design: z.number().optional(),
  xp_datalytics: z.number().optional(),
  indicacao_conteudo: z.string().optional(),
});

export type CardsUpdateDto = z.infer<typeof CardsUpdateSchema>;
