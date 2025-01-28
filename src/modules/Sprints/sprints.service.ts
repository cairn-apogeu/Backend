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

  async findById(id: number) {
    try {
      return await prisma.sprints.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Sprint não encontrada");
    }
  }

  async newSprint(toSprintsDto: Required<ToSprintsDto>) {
    try {
      return await prisma.sprints.create({
        data: {
          id_projeto: toSprintsDto.id_projeto,
          numero: toSprintsDto.numero,
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
}

export default new SprintService();
