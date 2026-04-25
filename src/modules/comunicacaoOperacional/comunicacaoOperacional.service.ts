import prisma from "../../clients/prisma.client";
import {
  ComunicacaoOperacionalDto,
  ComunicacaoOperacionalUpdateDto,
} from "./schemas/comunicacaoOperacional.schema";

class ComunicacaoOperacionalService {
  async findAll() {
    return prisma.comunicacaoOperacional.findMany();
  }

  async findById(id: number) {
    return prisma.comunicacaoOperacional.findUnique({ where: { id } });
  }

  async findBySprint(sprintId: number) {
    return prisma.comunicacaoOperacional.findMany({
      where: { sprint_id: sprintId },
    });
  }

  async findByProject(projectId: number) {
    return prisma.comunicacaoOperacional.findMany({
      where: { sprint: { id_projeto: projectId } },
    });
  }

  async findByUser(userId: string) {
    return prisma.comunicacaoOperacional.findMany({
      where: { user_id: userId },
    });
  }

  async create(data: ComunicacaoOperacionalDto) {
    return prisma.comunicacaoOperacional.create({ data });
  }

  async update(id: number, data: ComunicacaoOperacionalUpdateDto) {
    return prisma.comunicacaoOperacional.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.comunicacaoOperacional.delete({ where: { id } });
  }
}

export default new ComunicacaoOperacionalService();
