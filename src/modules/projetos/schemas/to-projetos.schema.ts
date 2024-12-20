import { z } from "zod";

export const ToProjetosSchema = z.object({
  nome: z.string(),
  valor: z.number(),
  status: z.string(),
  id_cliente: z.string(),
  id_gestor: z.string(),
  token: z.string(),
  repositorio: z.string(),
  owner: z.string(),
});

export type ToProjetosDto = z.infer<typeof ToProjetosSchema>;
