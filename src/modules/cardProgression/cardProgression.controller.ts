import { FastifyReply, FastifyRequest } from "fastify";
import progressionService from "./cardProgression.service";
import {
  CardProgressionDto,
  CardProgressionSchema,
  CardProgressionUpdateSchema,
} from "./schemas/cardProgression.schema";

class CardProgressionController {
  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await progressionService.findAll();
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
      const record = await progressionService.findById(id);
      if (!record) {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.send(record);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao buscar registro", error });
    }
  }

  async findByCard(
    request: FastifyRequest<{ Params: { cardId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const cardId = Number(request.params.cardId);
      if (Number.isNaN(cardId)) {
        return reply.status(400).send({ message: "ID de card inválido" });
      }
      const records = await progressionService.findByCard(cardId);
      reply.send(records);
    } catch (error) {
      reply.status(500).send({ message: "Falha ao listar histórico do card", error });
    }
  }

  async create(
    request: FastifyRequest<{ Body: CardProgressionDto }>,
    reply: FastifyReply
  ) {
    try {
      const payload = CardProgressionSchema.parse(request.body);
      const record = await progressionService.create(payload);
      reply.code(201).send(record);
    } catch (error) {
      reply.status(400).send({ message: "Dados inválidos", error });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<CardProgressionDto>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const payload = CardProgressionUpdateSchema.parse(request.body);
      const record = await progressionService.update(id, payload);
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
      await progressionService.delete(id);
      reply.status(204).send();
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.status(500).send({ message: "Falha ao remover registro", error });
    }
  }
}

export default new CardProgressionController();
