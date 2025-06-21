// Schema for AlunoProjetos
import { z } from 'zod';

export const alunoProjetosSchema = z.object({
  projeto_id: z.number(),
  aluno_id: z.string(),
});

export type AlunoProjetos = z.infer<typeof alunoProjetosSchema>;
