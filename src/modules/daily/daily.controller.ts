import { FastifyReply, FastifyRequest } from "fastify";
import dailyService from "./daily.service";
import { DailyDto, DailySchema, DailyUpdateSchema } from "./schemas/daily.schema";

class DailyController {
  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await dailyService.findAll();
      reply.send(records);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao listar registros", error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const record = await dailyService.findById(id);
      if (!record) {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.send(record);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao buscar registro", error });
    }
  }

  async findByProjeto(
    request: FastifyRequest<{ Params: { projetoId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const projetoId = Number(request.params.projetoId);
      if (Number.isNaN(projetoId)) {
        return reply.status(400).send({ message: "ID de projeto inválido" });
      }
      const records = await dailyService.findByProjeto(projetoId);
      reply.send(records);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao listar por projeto", error });
    }
  }

  async findBySprint(
    request: FastifyRequest<{ Params: { sprintId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const sprintId = Number(request.params.sprintId);
      if (Number.isNaN(sprintId)) {
        return reply.status(400).send({ message: "ID de sprint inválido" });
      }
      const records = await dailyService.findBySprint(sprintId);
      reply.send(records);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao listar por sprint", error });
    }
  }

  async create(
    request: FastifyRequest<{ Body: DailyDto }>,
    reply: FastifyReply
  ) {
    try {
      const payload = DailySchema.parse(request.body);
      const record = await dailyService.create(payload);
      console.log(record);
      
      reply.code(201).send(record);
    } catch (error) {
      reply.status(400).send({ message: "Dados inválidos", error });
    }
  }

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<DailyDto> }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const payload = DailyUpdateSchema.parse(request.body);
      const record = await dailyService.update(id, payload);
      reply.send(record);
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.status(400).send({ message: "Falha ao atualizar registro", error });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      await dailyService.delete(id);
      reply.status(204).send();
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.status(500).send({ message: "Falha ao remover registro", error });
    }
  }
}

export default new DailyController();
