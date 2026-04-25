import { Prisma, Status } from "@prisma/client";
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
        include: { DevsProjetos: true }
      });

      if (!projeto) throw new Error("Projeto do card não encontrado");

      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.id_rh === userId ||
        projeto.DevsProjetos.some((ap) => ap.dev_id === userId)
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
      const projectIdForValidation = await this.resolveProjectIdFromContext(
        createCardDto.projeto,
        createCardDto.sprint
      );
      await this.ensureProjectAllowsModification(projectIdForValidation);

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
      const { status, ...restCardData } = createCardDto;
      const cardData: Prisma.CardsUncheckedCreateInput = {
        ...restCardData,
        status: status as Status,
        order: newOrder,
      };
      return await prisma.cards.create({
        data: cardData,
      });
    } catch (error) {
      console.error("Erro no Prisma:", (error as any).message, error);
      throw new Error("Falha ao criar o card");
    }
  }
  

  async update(id: number, updateCardDto: CardsUpdateDto) {
    try {
      const existingCard = await prisma.cards.findUnique({ where: { id } });
      if (!existingCard) {
        throw new Error("Card não encontrado");
      }
      const previousStatus = existingCard.status as Status;

      const currentProjectId = await this.resolveProjectIdFromContext(
        existingCard.projeto,
        existingCard.sprint
      );
      await this.ensureProjectAllowsModification(currentProjectId);

      const desiredProjectId =
        updateCardDto.projeto !== undefined
          ? updateCardDto.projeto
          : existingCard.projeto;
      const desiredSprintId =
        updateCardDto.sprint !== undefined
          ? updateCardDto.sprint
          : existingCard.sprint;

      const targetProjectId = await this.resolveProjectIdFromContext(
        desiredProjectId,
        desiredSprintId
      );
      await this.ensureProjectAllowsModification(targetProjectId);

      const { status: statusUpdate, ...restUpdateData } = updateCardDto;
      const normalizedStatus = statusUpdate as Status | undefined;
      const updateData: Prisma.CardsUncheckedUpdateInput = {
        ...restUpdateData,
        ...(normalizedStatus ? { status: normalizedStatus } : {}),
      };

      const updatedCard = await prisma.cards.update({
        where: { id },
        data: updateData,
      });

      // Se o status foi atualizado para 'Doing', atualize o last_card do usuário
      if (
        normalizedStatus === Status.Doing &&
        updatedCard.assigned // só atualiza se houver assigned
      ) {
        await prisma.users.update({
          where: { user_clerk_id: updatedCard.assigned },
          data: { last_card: updatedCard.id },
        });
      }

      if (
        normalizedStatus &&
        previousStatus &&
        normalizedStatus !== previousStatus
      ) {
        await prisma.cardProgression.create({
          data: {
            card_id: updatedCard.id,
            projeto_id: updatedCard.projeto ?? null,
            sprint_id: updatedCard.sprint ?? null,
            from_status: previousStatus,
            to_status: normalizedStatus,
          },
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
      const card = await prisma.cards.findUnique({ where: { id } });
      if (!card) {
        throw new Error("Card não encontrado");
      }

      const projectId = await this.resolveProjectIdFromContext(
        card.projeto,
        card.sprint
      );
      await this.ensureProjectAllowsModification(projectId);

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
      const projeto = await prisma.projetos.findUnique({ where: { id: sprint.id_projeto }, include: { DevsProjetos: true } });
      if (!projeto) throw new Error("Projeto da sprint não encontrado");
      if (
        projeto.id_cliente === userId ||
        projeto.id_mentor === userId ||
        projeto.id_helper === userId ||
        projeto.id_rh === userId ||
        projeto.DevsProjetos.some((ap) => ap.dev_id === userId)
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
      const projeto = await prisma.projetos.findUnique({ where: { id: projectId }, include: { DevsProjetos: true } });
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
        projeto.id_rh === userId ||
        projeto.DevsProjetos.some((ap) => ap.dev_id === userId)
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
        'xp_data_analysis',
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

  private async resolveProjectIdFromContext(
    projectId?: number | null,
    sprintId?: number | null
  ): Promise<number | null> {
    if (typeof projectId === "number") {
      return projectId;
    }

    if (typeof sprintId === "number") {
      const sprint = await prisma.sprints.findUnique({
        where: { id: sprintId },
        select: { id_projeto: true },
      });
      if (!sprint) {
        throw new Error("Sprint não encontrada para validação de projeto.");
      }
      return sprint.id_projeto;
    }

    return null;
  }

  private async ensureProjectAllowsModification(projectId?: number | null) {
    if (projectId == null) {
      return;
    }

    const project = await prisma.projetos.findUnique({
      where: { id: projectId },
      select: { status: true },
    });

    if (!project) {
      throw new Error("Projeto não encontrado para validação dos cards.");
    }

    if (project.status?.toLowerCase() === "finalizado".toLowerCase()) {
      throw new Error("Não é possível alterar cards de um projeto finalizado.");
    }
  }

  private getTrackedStatuses(): Status[] {
    return [
      Status.Backlog,
      Status.ToDo,
      Status.Doing,
      Status.Done,
      Status.Prevented,
      Status.CanMine,
    ];
  }

  private initializeTotals() {
    return this.getTrackedStatuses().reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<Status, number>);
  }

  private cloneTotals(totals: Record<Status, number>) {
    const copy: Record<Status, number> = {} as Record<Status, number>;
    for (const status of Object.keys(totals) as Status[]) {
      copy[status] = totals[status];
    }
    return copy;
  }

  private adjustTotals(
    totals: Record<Status, number>,
    from: Status,
    to: Status
  ) {
    if (from in totals) {
      totals[from] = Math.max(0, totals[from] - 1);
    }
    if (to in totals) {
      totals[to] = (totals[to] ?? 0) + 1;
    }
  }

  private prepareCardSet(cardFilter: Prisma.CardsWhereInput) {
    return prisma.cards.findMany({
      where: cardFilter,
      select: { id: true, status: true },
    });
  }

  private async buildTimeline(params: {
    cards: { id: number; status: Status }[];
    progressions: {
      card_id: number;
      projeto_id: number | null;
      sprint_id: number | null;
      from_status: Status;
      to_status: Status;
      changed_at: Date;
    }[];
    startDate: Date;
  }) {
    const { cards, progressions, startDate } = params;
    const tracked = this.getTrackedStatuses();
    const totals = this.initializeTotals();
    const cardStatus = new Map<number, Status>();

    for (const card of cards) {
      cardStatus.set(card.id, card.status);
    }

    for (const entry of progressions) {
      if (entry.changed_at <= startDate) {
        cardStatus.set(entry.card_id, entry.to_status);
      } else {
        break;
      }
    }

    for (const status of cardStatus.values()) {
      if (tracked.includes(status)) {
        totals[status] += 1;
      }
    }

    const timeline: { date: Date; totals: Record<Status, number> }[] = [
      { date: startDate, totals: this.cloneTotals(totals) },
    ];

    for (const entry of progressions) {
      if (entry.changed_at <= startDate) continue;
      this.adjustTotals(
        totals,
        entry.from_status as Status,
        entry.to_status as Status
      );
      timeline.push({
        date: entry.changed_at,
        totals: this.cloneTotals(totals),
      });
    }

    return timeline;
  }

  async getStatusTimelineByProject(projectId: number) {
    const project = await prisma.projetos.findUnique({
      where: { id: projectId },
      select: { dia_inicio: true, dia_fim: true },
    });
    if (!project) {
      throw new Error("Projeto não encontrado");
    }
    const startDate = project.dia_inicio ?? new Date();
    const endDate = project.dia_fim ?? new Date();

    const cards = await this.prepareCardSet({ projeto: projectId });
    if (cards.length === 0) {
      return {
        projectId,
        sprintId: null,
        startDate,
        endDate,
        points: 0,
        sample: [],
      };
    }

    const cardIds = cards.map((card) => card.id);

    const progressions = await prisma.cardProgression.findMany({
      where: {
        card_id: { in: cardIds },
        projeto_id: projectId,
        changed_at: { lte: endDate },
      },
      orderBy: { changed_at: "asc" },
    });

    const sample = await this.buildTimeline({
      cards,
      progressions,
      startDate,
    });

    return {
      projectId,
      sprintId: null,
      startDate,
      endDate,
      points: sample.length,
      sample,
    };
  }

  async getStatusTimelineBySprint(sprintId: number) {
    const sprint = await prisma.sprints.findUnique({
      where: { id: sprintId },
      select: {
        id_projeto: true,
        dia_inicio: true,
        dia_fim: true,
      },
    });
    if (!sprint) {
      throw new Error("Sprint não encontrada");
    }

    const projectId = sprint.id_projeto;
    const startDate = sprint.dia_inicio ?? new Date();
    const endDate = sprint.dia_fim ?? new Date();

    const cards = await this.prepareCardSet({
      projeto: projectId,
      sprint: sprintId,
    });
    if (cards.length === 0) {
      return {
        projectId,
        sprintId,
        startDate,
        endDate,
        points: 0,
        sample: [],
      };
    }

    const cardIds = cards.map((card) => card.id);

    const progressions = await prisma.cardProgression.findMany({
      where: {
        card_id: { in: cardIds },
        sprint_id: sprintId,
        projeto_id: projectId,
        changed_at: { lte: endDate },
      },
      orderBy: { changed_at: "asc" },
    });

    const sample = await this.buildTimeline({
      cards,
      progressions,
      startDate,
    });

    return {
      projectId,
      sprintId,
      startDate,
      endDate,
      points: sample.length,
      sample,
    };
  }
}

export default new CardsService();
