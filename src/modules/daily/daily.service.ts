import prisma from "../../clients/prisma.client";
import { DailyDto, DailyUpdateDto } from "./schemas/daily.schema";

const includeRelations = {
  presencasDev: true,
};

class DailyService {
  async findAll() {
    return prisma.daily.findMany({ include: includeRelations });
  }

  async findById(id: number) {
    return prisma.daily.findUnique({ where: { id }, include: includeRelations });
  }

  async findByProjeto(projetoId: number) {
    return prisma.daily.findMany({
      where: { projeto_id: projetoId },
      include: includeRelations,
    });
  }

  async findBySprint(sprintId: number) {
    return prisma.daily.findMany({
      where: { sprint_id: sprintId },
      include: includeRelations,
    });
  }

  async create(data: DailyDto) {
    const { presencas = [], ...dailyData } = data;

    return prisma.$transaction(async (tx) => {
      const daily = await tx.daily.create({ data: dailyData });

      if (presencas.length > 0) {
        await tx.dailyDevPresence.createMany({
          data: presencas.map((presence) => ({
            daily_id: daily.id,
            dev_id: presence.dev_id,
            presente: presence.presente ?? true,
          })),
        });
      }

      return tx.daily.findUnique({
        where: { id: daily.id },
        include: includeRelations,
      });
    });
  }

  async update(id: number, data: DailyUpdateDto) {
    const { presencas, ...dailyData } = data;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.daily.update({
        where: { id },
        data: dailyData,
      });

      if (presencas) {
        await tx.dailyDevPresence.deleteMany({ where: { daily_id: id } });
        if (presencas.length > 0) {
          await tx.dailyDevPresence.createMany({
            data: presencas.map((presence) => ({
              daily_id: id,
              dev_id: presence.dev_id,
              presente: presence.presente ?? true,
            })),
          });
        }
      }

      return tx.daily.findUnique({
        where: { id: updated.id },
        include: includeRelations,
      });
    });
  }

  async delete(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.dailyDevPresence.deleteMany({ where: { daily_id: id } });
      return tx.daily.delete({ where: { id } });
    });
  }
}

export default new DailyService();
