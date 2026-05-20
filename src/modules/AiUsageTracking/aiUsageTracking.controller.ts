import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import aiUsageTrackingService from "./aiUsageTracking.service";
import { CreateTrackingSchema } from "./schemas/create-tracking.schema";
import { UpdateTrackingSchema } from "./schemas/update-tracking.schema";

class AiUsageTrackingController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const dto = CreateTrackingSchema.parse(request.body);
      const record = await aiUsageTrackingService.create(userId, dto);
      reply.code(201).send(record);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return reply.code(400).send({ error: "Dados inválidos", details: error });
      }
      console.error("Erro ao criar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async findByUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const records = await aiUsageTrackingService.findByUser(userId);
      reply.send(records);
    } catch (error: unknown) {
      console.error("Erro ao buscar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const { id } = request.params;
      const record = await aiUsageTrackingService.findById(id, userId);
      reply.send(record);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        return reply.code(403).send({ error: "Acesso não autorizado" });
      }
      console.error("Erro ao buscar tracking por ID:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async update(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const { id } = request.params;
      const dto = UpdateTrackingSchema.parse(request.body);
      const record = await aiUsageTrackingService.update(id, userId, dto);
      reply.send(record);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        return reply.code(403).send({ error: "Acesso não autorizado" });
      }
      console.error("Erro ao atualizar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }
}

export default new AiUsageTrackingController();
