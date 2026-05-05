import prisma from "../../clients/prisma.client";

class StatisticsService {
  async findAll() {
    return prisma.userStatistics.findMany();
  }

  async findByUserId(user_clerk_id: string) {
    return prisma.userStatistics.findUnique({
      where: { user_clerk_id },
    });
  }

  async create(user_clerk_id: string, data: Partial<Omit<Parameters<typeof prisma.userStatistics.create>[0]['data'], 'user_clerk_id'>>) {
    const { id, user_clerk_id: _, user, ...safeData } = data as any;
    return prisma.userStatistics.create({
      data: { user_clerk_id, ...safeData },
    });
  }

  async update(user_clerk_id: string, data: Partial<Omit<Parameters<typeof prisma.userStatistics.update>[0]['data'], 'user_clerk_id'>>) {
    // Verifica se existe antes de atualizar
    const exists = await prisma.userStatistics.findUnique({ where: { user_clerk_id } });
    if (!exists) {
      throw new Error("Registro não encontrado para update");
    }
    // Remove campos proibidos e 'id' undefined
    const { id, user_clerk_id: _, ...safeData } = data as any;
    // Remove 'id' se for undefined
    if (typeof safeData.id !== 'undefined') {
      delete safeData.id;
    }
    return prisma.userStatistics.update({
      where: { user_clerk_id },
      data: safeData,
    });
  }

  async delete(user_clerk_id: string) {
    // Verifica se existe antes de deletar
    const exists = await prisma.userStatistics.findUnique({ where: { user_clerk_id } });
    if (!exists) {
      throw new Error("Registro não encontrado para delete");
    }
    return prisma.userStatistics.delete({
      where: { user_clerk_id },
    });
  }
}

export default new StatisticsService();
