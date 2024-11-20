import { z } from 'zod';

export const CardsUpdateSchema = z.object({
  id: z.number().optional(), // A ID do card pode ser opcional em algumas situações (por exemplo, se for fornecida na URL)
  titulo: z.string().max(100).optional(),
  descricao: z.string().optional(),
  status: z.string().max(20).optional(),
  tempo_estimado: z.number().optional(),
  tempo: z.number().optional(),
  assigned: z.number().optional(),
  sprint: z.number().optional(),
  dod: z.array(z.string()).optional(),
  dor: z.array(z.string()).optional(),
  xp_frontend: z.number().optional(),
  xp_backend: z.number().optional(),
  xp_negocios: z.number().optional(),
  xp_arquitetura: z.number().optional(),
  xp_design: z.number().optional(),
  xp_datalytics: z.number().optional(),
  indicacao_conteudo: z.string().optional(),
});

export type CardsUpdateDto = z.infer<typeof CardsUpdateSchema>;
