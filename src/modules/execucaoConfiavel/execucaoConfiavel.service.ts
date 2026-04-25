import prisma from "../../clients/prisma.client";
import {
  ExecucaoConfiavelDto,
  ExecucaoConfiavelUpdateDto,
} from "./schemas/execucaoConfiavel.schema";

class ExecucaoConfiavelService {
  async findAll() {
    return prisma.execucaoConfiavel.findMany();
  }

  async findById(id: number) {
    return prisma.execucaoConfiavel.findUnique({ where: { id } });
  }

  async findBySprint(sprintId: number) {
    return prisma.execucaoConfiavel.findMany({
      where: { sprint_id: sprintId },
    });
  }

  async findByProject(projectId: number) {
    return prisma.execucaoConfiavel.findMany({
      where: { sprint: { id_projeto: projectId } },
    });
  }

  async findByUser(userId: string) {
    return prisma.execucaoConfiavel.findMany({
      where: { user_id: userId },
    });
  }

  async create(data: ExecucaoConfiavelDto) {
    return prisma.execucaoConfiavel.create({ data });
  }

  async update(id: number, data: ExecucaoConfiavelUpdateDto) {
    return prisma.execucaoConfiavel.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.execucaoConfiavel.delete({ where: { id } });
  }
}

export default new ExecucaoConfiavelService();
