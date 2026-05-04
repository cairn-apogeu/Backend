import prisma from "../../clients/prisma.client";
import { ToSprintsDto } from "./schemas/to-sprints.schema";
import { UpdateSprints } from "./schemas/update-sprints.schema";

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
        include: { DevsProjetos: true }
      });
      if (!projeto) throw new Error("Projeto da sprint não encontrado");
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.id_rh === userId ||
        projeto.DevsProjetos.some(
          (ap: (typeof projeto.DevsProjetos)[number]) => ap.dev_id === userId
        )
      ) {
        return sprint;
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto da sprint");
    } catch (error) {
      throw new Error("Falha ao encontrar a sprint ou acesso negado");
    }
  }

  async newSprint(data: ToSprintsDto) {
    console.log("Criando nova sprint com os dados:", data);
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

  async updateSprint(id: number, toSprintsDto: UpdateSprints, userId: string) {
    const sprint = await prisma.sprints.findUnique({ where: { id } });
    if (!sprint) {
      throw new Error("Sprint não encontrada");
    }

    await this.ensureProjectAccess(sprint.id_projeto, userId);

    if (
      typeof toSprintsDto.id_projeto === "number" &&
      toSprintsDto.id_projeto !== sprint.id_projeto
    ) {
      await this.ensureProjectAccess(toSprintsDto.id_projeto, userId);
    }

    try {
      return await prisma.sprints.update({
        where: { id },
        data: toSprintsDto,
      });
    } catch (error: any) {
      if (error?.code === "P2003") {
        throw new Error("Projeto inválido para atualização da sprint");
      }
      throw new Error("Falha ao atualizar sprint");
    }
  }

  async deleteSprint(id: number, userId: string) {
    const sprint = await prisma.sprints.findUnique({ where: { id } });
    if (!sprint) {
      throw new Error("Sprint não encontrada");
    }

    await this.ensureProjectAccess(sprint.id_projeto, userId);

    try {
      return await prisma.$transaction(async (tx) => {
        const cards = await tx.cards.findMany({
          where: { sprint: id },
          select: { id: true },
        });
        const cardIds = cards.map((card) => card.id);

        if (cardIds.length > 0) {
          await tx.cardProgression.deleteMany({
            where: { card_id: { in: cardIds } },
          });

          await tx.users.updateMany({
            where: { last_card: { in: cardIds } },
            data: { last_card: null },
          });

          await tx.cards.deleteMany({
            where: { id: { in: cardIds } },
          });
        }

        await tx.cardProgression.deleteMany({
          where: { sprint_id: id },
        });

        await tx.capacidadeCognitivaAplicada.deleteMany({
          where: { sprint_id: id },
        });
        await tx.comunicacaoOperacional.deleteMany({
          where: { sprint_id: id },
        });
        await tx.execucaoConfiavel.deleteMany({
          where: { sprint_id: id },
        });
        await tx.contribuicaoSistemica.deleteMany({
          where: { sprint_id: id },
        });

        const dailies = await tx.daily.findMany({
          where: { sprint_id: id },
          select: { id: true },
        });
        const dailyIds = dailies.map((daily) => daily.id);

        if (dailyIds.length > 0) {
          await tx.dailyDevPresence.deleteMany({
            where: { daily_id: { in: dailyIds } },
          });
        }

        await tx.daily.deleteMany({
          where: { sprint_id: id },
        });

        return tx.sprints.delete({
          where: { id },
        });
      });
    } catch (error) {
      throw new Error("Falha ao deletar sprint");
    }
  }

  async findAllByProjetoId(id_projeto: number, userId: string) {
    try {
      await this.ensureProjectAccess(id_projeto, userId);
      return await prisma.sprints.findMany({ where: { id_projeto } });
    } catch (error) {
      throw new Error("Falha ao buscar sprints do projeto ou acesso negado");
    }
  }

  private async ensureProjectAccess(projectId: number, userId: string) {
    const projeto = await prisma.projetos.findUnique({
      where: { id: projectId },
      include: { DevsProjetos: true },
    });
    if (!projeto) {
      throw new Error("Projeto não encontrado");
    }

    const user = await prisma.users.findUnique({
      where: { user_clerk_id: userId },
      select: { tipo_perfil: true },
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.tipo_perfil === "Admin") {
      return;
    }

    const canAccess =
      projeto.id_cliente === userId ||
      projeto.id_mentor === userId ||
      projeto.id_helper === userId ||
      projeto.id_rh === userId ||
      projeto.DevsProjetos.some(
        (ap: (typeof projeto.DevsProjetos)[number]) => ap.dev_id === userId
      );

    if (!canAccess) {
      throw new Error("Acesso negado: usuário não faz parte do projeto");
    }
  }
}

export default new SprintService();
