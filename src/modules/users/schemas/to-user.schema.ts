import { z } from "zod";

export const ToUserSchema = z.object({
  user_clerk_id: z.string(),
  tipo_perfil: z.string().max(10),
  discord: z.string().max(20).nullable().optional(),
  linkedin: z.string().max(30).nullable().optional(),
  github: z.string().max(30).nullable().optional(),
  objetivo_curto: z.string().nullable().optional(),
  objetivo_medio: z.string().nullable().optional(),
  objetivo_longo: z.string().nullable().optional(),
  genero: z.string().max(10).nullable().optional(),
  nascimento: z.string().nullable().optional(),
});

export type ToUserDto = z.infer<typeof ToUserSchema>;
