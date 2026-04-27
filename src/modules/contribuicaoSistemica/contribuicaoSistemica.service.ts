import prisma from "../../clients/prisma.client";
import {
  ContribuicaoSistemicaDto,
  ContribuicaoSistemicaUpdateDto,
} from "./schemas/contribuicaoSistemica.schema";

class ContribuicaoSistemicaService {
  async findAll() {
    return prisma.contribuicaoSistemica.findMany();
  }

  async findById(id: number) {
    return prisma.contribuicaoSistemica.findUnique({ where: { id } });
  }

  async findBySprint(sprintId: number) {
    return prisma.contribuicaoSistemica.findMany({
      where: { sprint_id: sprintId },
    });
  }

  async findByProject(projectId: number) {
    return prisma.contribuicaoSistemica.findMany({
      where: { sprint: { id_projeto: projectId } },
    });
  }

  async findByUser(userId: string) {
    return prisma.contribuicaoSistemica.findMany({
      where: { user_id: userId },
    });
  }

  async create(data: ContribuicaoSistemicaDto) {
    return prisma.contribuicaoSistemica.create({ data });
  }

  async update(id: number, data: ContribuicaoSistemicaUpdateDto) {
    return prisma.contribuicaoSistemica.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.contribuicaoSistemica.delete({ where: { id } });
  }
}

export default new ContribuicaoSistemicaService();
