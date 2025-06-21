import prisma from "../../clients/prisma.client";
import { CardsDto } from "./schemas/create-Cards.schema";
import { CardsUpdateDto } from "./schemas/update-Cards.schema";

class CardsService {
  async findAll() {
    try {
      return await prisma.cards.findMany();
    } catch (error) {
      throw new Error("Falha ao recuperar os cards");
    }
  }

  async findById(id: number, userId: string) {
    try {
      const card = await prisma.cards.findUnique({
        where: { id },
      });

      if (!card) throw new Error("Card não encontrado");

      // Busca o usuário
      const user = await prisma.users.findUnique({
        where: { user_clerk_id: userId },
        select: { tipo_perfil: true }
      });

      if (!user) throw new Error("Usuário não encontrado");

      // Admin pode acessar qualquer card
      if (user.tipo_perfil === "Admin") return card;

      // Se não for admin, precisa estar relacionado ao projeto do card
      if (!card.projeto) throw new Error("Card não está vinculado a um projeto");

      const projeto = await prisma.projetos.findUnique({
        where: { id: card.projeto },
        include: { AlunosProjetos: true }
      });

      if (!projeto) throw new Error("Projeto do card não encontrado");

      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return card;
      }

      throw new Error("Acesso negado: usuário não faz parte do projeto do card");
    } catch (error) {
      throw new Error("Falha ao encontrar o card ou acesso negado");
    }
  }

  async create(createCardDto: CardsDto) {
    try {
      console.log("Dados enviados ao Prisma:", createCardDto);
      // Descobre o maior valor de order no contexto (sprint ou projeto)
      let contextFilter: any = {};
      if (createCardDto.sprint) {
        contextFilter.sprint = createCardDto.sprint;
      } else if (createCardDto.projeto) {
        contextFilter.projeto = createCardDto.projeto;
      }
      let lastCard = null;
      if (Object.keys(contextFilter).length > 0) {
        lastCard = await prisma.cards.findFirst({
          where: contextFilter,
          orderBy: { order: 'desc' },
        });
      }
      const newOrder = lastCard && lastCard.order != null ? lastCard.order + 1 : 1;
      return await prisma.cards.create({
        data: {
          ...createCardDto,
          order: newOrder,
        },
      });
    } catch (error) {
      console.error("Erro no Prisma:", (error as any).message, error);
      throw new Error("Falha ao criar o card");
    }
  }
  

  async update(id: number, updateCardDto: CardsUpdateDto) {
    try {
      const updatedCard = await prisma.cards.update({
        where: { id },
        data: updateCardDto,
      });

      // Se o status foi atualizado para 'Doing', atualize o last_card do usuário
      if (
        updateCardDto.status === 'Doing' &&
        updatedCard.assigned // só atualiza se houver assigned
      ) {
        await prisma.users.update({
          where: { user_clerk_id: updatedCard.assigned },
          data: { last_card: updatedCard.id },
        });
      }

      return updatedCard;
    } catch (error) {
      console.log(error);
      throw new Error("Falha ao atualizar o card");
      
    }
  }

  async delete(id: number) {
    try {
      return await prisma.cards.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar o card");
    }
  }

  async findByAssignedUser(userId: string) {
    try {
      return await prisma.cards.findMany({
        where: { assigned: userId },
      });
    } catch (error) {
      throw new Error("Falha ao recuperar os cards atribuídos ao usuário");
    }
  }

  async findBySprint(sprintId: number, userId: string) {
    try {
      // Busca a sprint para checar acesso
      const sprint = await prisma.sprints.findUnique({ where: { id: sprintId } });
      if (!sprint) throw new Error("Sprint não encontrada");
      // Busca o usuário
      const user = await prisma.users.findUnique({ where: { user_clerk_id: userId }, select: { tipo_perfil: true } });
      if (!user) throw new Error("Usuário não encontrado");
      if (user.tipo_perfil === "Admin") {
        return await prisma.cards.findMany({ where: { sprint: sprintId } });
      }
      // Busca o projeto da sprint
      const projeto = await prisma.projetos.findUnique({ where: { id: sprint.id_projeto }, include: { AlunosProjetos: true } });
      if (!projeto) throw new Error("Projeto da sprint não encontrado");
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return await prisma.cards.findMany({ where: { sprint: sprintId } });
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto da sprint");
    } catch (error) {
      throw new Error("Falha ao recuperar os cards para a sprint ou acesso negado");
    }
  }

  async findByProject(projectId: number, userId: string) {
    try {
      // Busca o projeto para checar acesso
      const projeto = await prisma.projetos.findUnique({ where: { id: projectId }, include: { AlunosProjetos: true } });
      if (!projeto) throw new Error("Projeto não encontrado");
      // Busca o usuário
      const user = await prisma.users.findUnique({ where: { user_clerk_id: userId }, select: { tipo_perfil: true } });
      if (!user) throw new Error("Usuário não encontrado");
      if (user.tipo_perfil === "Admin") {
        return await prisma.cards.findMany({ where: { projeto: projectId } });
      }
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.AlunosProjetos.some((ap) => ap.aluno_id === userId)
      ) {
        return await prisma.cards.findMany({ where: { projeto: projectId } });
      }
      throw new Error("Acesso negado: usuário não faz parte do projeto");
    } catch (error) {
      throw new Error("Falha ao recuperar os cards para o projeto ou acesso negado");
    }
  }

  async computeXpForUncomputedCardsByProject(projectId: number) {
    const xpMap = {
      MUITO_FACIL: 10,
      FACIL: 20,
      MEDIO: 30,
      DIFICIL: 40,
      MUITO_DIFICIL: 50,
    };

    const cards = await prisma.cards.findMany({
      where: {
        computed: false,
        projeto: projectId,
        assigned: { not: null },
        difficulty: { not: null }
      }
    });

    for (const card of cards) {
      const xpValue = xpMap[card.difficulty as keyof typeof xpMap] || 0;
      if (!card.assigned) continue;

      const xpFields = [
        'xp_frontend',
        'xp_backend',
        'xp_negocios',
        'xp_arquitetura',
        'xp_design',
        'xp_datalytics',
      ];

      const xpUpdate: Record<string, any> = {};

      // Incrementa XP apenas para os campos xp_* que forem true no card
      for (const xpField of xpFields) {
        if ((card as any)[xpField]) {
          xpUpdate[xpField] = { increment: xpValue };
        }
      }

      // Cálculos adicionais para estatísticas
      const tempoReal = card.tempo || 0;
      const tempoEstimado = card.tempo_estimado || 0;
      let deltaPredict = 0;
      if (tempoReal > 0 && tempoEstimado > 0) {
        deltaPredict = (tempoReal / tempoEstimado - 1) * 100;
      }
      // Atualização dos campos adicionais
      xpUpdate.total_throughput = { increment: tempoReal };
      xpUpdate.average_daily = { increment: tempoReal / 14 };

      let userStats = await prisma.userStatistics.findUnique({
        where: { user_clerk_id: card.assigned }
      });
      if (!userStats) {
        await prisma.userStatistics.create({
          data: { user_clerk_id: card.assigned }
        });
        // Se não existe, só soma o valor calculado
        xpUpdate.deltatime_predict = { increment: deltaPredict };
      } else {
        // Se já existe, faz a média
        if (typeof userStats.deltatime_predict === 'number') {
          const newDelta = (userStats.deltatime_predict + deltaPredict) / 2;
          xpUpdate.deltatime_predict = { set: newDelta };
        } else {
          xpUpdate.deltatime_predict = { increment: deltaPredict };
        }
      }

      if (Object.keys(xpUpdate).length > 0) {
        await prisma.userStatistics.update({
          where: { user_clerk_id: card.assigned },
          data: xpUpdate
        });
      }

      await prisma.cards.update({
        where: { id: card.id },
        data: { computed: true }
      });
    }
  }

  async computeXpForUncomputedCardsBySprint(sprintId: number) {
    const xpMap = {
      MUITO_FACIL: 10,
      FACIL: 20,
      MEDIO: 30,
      DIFICIL: 40,
      MUITO_DIFICIL: 50,
    };

    const cards = await prisma.cards.findMany({
      where: {
        computed: false,
        sprint: sprintId,
        assigned: { not: null },
        difficulty: { not: null }
      }
    });

    for (const card of cards) {
      const xpValue = xpMap[card.difficulty as keyof typeof xpMap] || 0;
      if (!card.assigned) continue;

      const xpFields = [
        'xp_frontend',
        'xp_backend',
        'xp_negocios',
        'xp_arquitetura',
        'xp_design',
        'xp_datalytics',
        'xp_data_analysis',
      ];

      const xpUpdate: Record<string, any> = {};

      for (const xpField of xpFields) {
        if ((card as any)[xpField]) {
          xpUpdate[xpField] = { increment: xpValue };
        }
      }

      // Cálculos adicionais para estatísticas
      const tempoReal = card.tempo || 0;
      const tempoEstimado = card.tempo_estimado || 0;
      let deltaPredict = 0;
      if (tempoReal > 0 && tempoEstimado > 0) {
        deltaPredict = (tempoReal / tempoEstimado - 1) * 100;
      }
      xpUpdate.total_throughput = { increment: tempoReal };
      xpUpdate.average_daily = { increment: tempoReal / 14 };

      let userStats = await prisma.userStatistics.findUnique({
        where: { user_clerk_id: card.assigned }
      });
      if (!userStats) {
        await prisma.userStatistics.create({
          data: { user_clerk_id: card.assigned }
        });
        xpUpdate.deltatime_predict = { increment: deltaPredict };
      } else {
        if (typeof userStats.deltatime_predict === 'number') {
          const newDelta = (userStats.deltatime_predict + deltaPredict) / 2;
          xpUpdate.deltatime_predict = { set: newDelta };
        } else {
          xpUpdate.deltatime_predict = { increment: deltaPredict };
        }
      }

      if (Object.keys(xpUpdate).length > 0) {
        await prisma.userStatistics.update({
          where: { user_clerk_id: card.assigned },
          data: xpUpdate
        });
      }

      await prisma.cards.update({
        where: { id: card.id },
        data: { computed: true }
      });
    }

    await prisma.sprints.update({
      where: { id: sprintId },
      data: { computed: true }
    });
  }
}

export default new CardsService();
