import prisma from "../../clients/prisma.client";
import { CreateTrackingDto } from "./schemas/create-tracking.schema";
import { UpdateTrackingDto } from "./schemas/update-tracking.schema";

class AiUsageTrackingService {
  async create(userId: string, dto: CreateTrackingDto) {
    try {
      const doingCards = await prisma.cards.findMany({
        where: {
          assigned: userId,
          status: "Doing",
        },
        select: {
          id: true,
          titulo: true,
          status: true,
        },
      });

      const snapshot = doingCards.map((card) => ({
        id: card.id,
        title: card.titulo,
        status: card.status,
      }));

      return await prisma.aiUsageTracking.create({
        data: {
          user_id: userId,
          prompt: dto.prompt,
          devin_response: dto.devin_response ?? null,
          devin_session_id: dto.devin_session_id ?? null,
          acu_consumption_after_response:
            dto.acu_consumption_after_response ?? null,
          doing_cards_snapshot: snapshot,
        },
      });
    } catch (error) {
      console.error("Erro ao criar registro de tracking:", error);
      throw new Error("Falha ao criar registro de tracking de uso de IA");
    }
  }

  async findByUser(userId: string) {
    try {
      return await prisma.aiUsageTracking.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      });
    } catch (error) {
      throw new Error("Falha ao buscar registros de tracking");
    }
  }

  async findById(id: string, userId: string) {
    try {
      const record = await prisma.aiUsageTracking.findUnique({
        where: { id },
      });

      if (!record) {
        throw new Error("Registro não encontrado");
      }

      if (record.user_id !== userId) {
        throw new Error("Acesso não autorizado");
      }

      return record;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        throw error;
      }
      throw new Error("Falha ao buscar registro de tracking");
    }
  }

  async update(id: string, userId: string, dto: UpdateTrackingDto) {
    try {
      const record = await prisma.aiUsageTracking.findUnique({
        where: { id },
      });

      if (!record) {
        throw new Error("Registro não encontrado");
      }

      if (record.user_id !== userId) {
        throw new Error("Acesso não autorizado");
      }

      return await prisma.aiUsageTracking.update({
        where: { id },
        data: {
          acu_consumption_after_response:
            dto.acu_consumption_after_response ?? null,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        throw error;
      }
      throw new Error("Falha ao atualizar registro de tracking");
    }
  }
}

export default new AiUsageTrackingService();
