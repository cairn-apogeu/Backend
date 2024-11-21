import { z } from "zod";

export const ToProjetosSchema = z.object({
  nome: z.string(),
  valor: z.number(),
  status: z.string(),
  id_cliente: z.number(),
  id_gestor: z.number(),
});

export type ToProjetosDto = z.infer<typeof ToProjetosSchema>;
