import { FastifyRequest, FastifyReply } from "fastify";
import statisticsService from "./statistics.service";
import { StatisticsSchema } from "./schemas/statistics.schema";

class StatisticsController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await statisticsService.findAll();
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByUserId(request: FastifyRequest<{ Params: { user_clerk_id: string } }>, reply: FastifyReply) {
    try {
      const { user_clerk_id } = request.params;
      const stat = await statisticsService.findByUserId(user_clerk_id);
      if (!stat) return reply.status(404).send({ message: "Not found" });
      reply.send(stat);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async create(request: FastifyRequest<{ Params: { user_clerk_id: string }; Body: any }>, reply: FastifyReply) {
    try {
      const { user_clerk_id } = request.params;
      const parse = StatisticsSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ message: "Dados inválidos", errors: parse.error.errors });
      }
      const stat = await statisticsService.create(user_clerk_id, parse.data);
      reply.send(stat);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async update(request: FastifyRequest<{ Params: { user_clerk_id: string }; Body: any }>, reply: FastifyReply) {
    try {
      const { user_clerk_id } = request.params;
      const parse = StatisticsSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ message: "Dados inválidos", errors: parse.error.errors });
      }
      try {
        const stat = await statisticsService.update(user_clerk_id, parse.data);
        reply.send(stat);
      } catch (err: any) {
        if (err.message && err.message.includes("Registro não encontrado")) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async delete(request: FastifyRequest<{ Params: { user_clerk_id: string } }>, reply: FastifyReply) {
    try {
      const { user_clerk_id } = request.params;
      try {
        const stat = await statisticsService.delete(user_clerk_id);
        reply.send(stat);
      } catch (err: any) {
        if (err.message && err.message.includes("Registro não encontrado")) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }
}

export default new StatisticsController();
