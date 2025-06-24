import prisma from "../../clients/prisma.client";
import { ToSprintsDto } from "./schemas/to-sprints.schema";

class SprintService {
  async findAll() {
    try {
      return await prisma.sprints.findMany();
    } catch (error) {
      throw new Error("Tabela 'Sprints' não encontrada");
    }
  }

  async findById(id: number, userId: string) {
    try {
      const sprint = await prisma.sprints.findUnique({
        where: { id },
      });
      if (!sprint) throw new Error("Sprint não encontrada");
      // Busca o usuário
      const user = await prisma.users.findUnique({
        where: { user_clerk_id: userId },
        select: { tipo_perfil: true }
      });
      if (!user) throw new Error("Usuário não encontrado");
      // Admin pode acessar qualquer sprint
      if (user.tipo_perfil === "Admin") return sprint;
      // Se não for admin, precisa estar relacionado ao projeto da sprint
      const projeto = await prisma.projetos.findUnique({
        where: { id: sprint.id_projeto },
        include: { AlunosProjetos: true }
      });
      if (!projeto) throw new Error("Projeto da sprint não encontrado");
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return sprint;
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto da sprint");
    } catch (error) {
      throw new Error("Falha ao encontrar a sprint ou acesso negado");
    }
  }

  async newSprint(data: ToSprintsDto) {
    try {
      return await prisma.sprints.create({
        data: {
          id_projeto: data.id_projeto,
          numero: data.numero,
          objetivo: data.objetivo, 
          dia_inicio: data.dia_inicio, 
          dia_fim: data.dia_fim,       
        },
      });
    } catch (error) {
      throw new Error("Falha ao criar sprint");
    }
  }

  async updateSprint(id: number, toSprintsDto: Partial<ToSprintsDto>) {
    try {
      return await prisma.sprints.update({
        where: { id },
        data: toSprintsDto,
      });
    } catch (error) {
      throw new Error("Falha ao atualizar sprint");
    }
  }

  async deleteSprint(id: number) {
    try {
      return await prisma.sprints.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar sprint");
    }
  }

  async findAllByProjetoId(id_projeto: number, userId: string) {
    try {
      // Busca o projeto para checar acesso
      const projeto = await prisma.projetos.findUnique({ where: { id: id_projeto }, include: { AlunosProjetos: true } });
      if (!projeto) throw new Error("Projeto não encontrado");
      // Busca o usuário
      const user = await prisma.users.findUnique({ where: { user_clerk_id: userId }, select: { tipo_perfil: true } });
      if (!user) throw new Error("Usuário não encontrado");
      if (user.tipo_perfil === "Admin") {
        return await prisma.sprints.findMany({ where: { id_projeto } });
      }
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return await prisma.sprints.findMany({ where: { id_projeto } });
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto");
    } catch (error) {
      throw new Error("Falha ao buscar sprints do projeto ou acesso negado");
    }
  }
}

export default new SprintService();
