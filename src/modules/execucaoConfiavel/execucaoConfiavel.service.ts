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
