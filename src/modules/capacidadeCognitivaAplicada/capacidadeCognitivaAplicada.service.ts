import prisma from "../../clients/prisma.client";
import {
  CapacidadeCognitivaAplicadaDto,
  CapacidadeCognitivaAplicadaUpdateDto,
} from "./schemas/capacidadeCognitivaAplicada.schema";

class CapacidadeCognitivaAplicadaService {
  async findAll() {
    return prisma.capacidadeCognitivaAplicada.findMany();
  }

  async findById(id: number) {
    return prisma.capacidadeCognitivaAplicada.findUnique({ where: { id } });
  }

  async create(data: CapacidadeCognitivaAplicadaDto) {
    return prisma.capacidadeCognitivaAplicada.create({ data });
  }

  async update(id: number, data: CapacidadeCognitivaAplicadaUpdateDto) {
    return prisma.capacidadeCognitivaAplicada.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.capacidadeCognitivaAplicada.delete({ where: { id } });
  }
}

export default new CapacidadeCognitivaAplicadaService();
