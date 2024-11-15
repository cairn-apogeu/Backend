import { z } from 'zod';
export const CardsSchema = z.object({
  titulo: z.string().max(100),
  descricao: z.string().optional(),
  status: z.string().max(20),
  tempo_estimado: z.number().optional(),
  tempo: z.number().optional(),
  assigned: z.number().optional(),
  sprint: z.number().optional(),
  dod: z.array(z.string()).optional(),
  dor: z.array(z.string()).optional(),
  xp: z.number().optional(),
  tipo: z.string().optional(),
  indicacao_conteudo: z.string().optional(),
});

export type CardsDto = z.infer<typeof CardsSchema>;

