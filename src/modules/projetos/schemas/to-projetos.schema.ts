import { z } from "zod";

export const ToProjetosSchema = z.object({
  nome: z.string(),
  valor: z.number().optional(),
  status: z.string().optional(),
  id_cliente: z.string().optional(),
  id_mentor: z.string().optional(),
  id_helper: z.string().optional(),
  token: z.string().optional(),
  repositorio: z.string().optional(),
  owner: z.string().optional(),
  dia_inicio: z.date().optional(),
  dia_fim: z.date().optional(),
  logo_url: z.string().optional(),
});

export type ToProjetosDto = z.infer<typeof ToProjetosSchema>;
