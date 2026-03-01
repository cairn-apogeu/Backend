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
