import { FastifyRequest, FastifyReply } from "fastify";
import sprintService from "./sprints.service";
import { SprintsIdSchema } from "./schemas/sprints-id.schema";
import { ToSprintsDto } from "./schemas/to-sprints.schema";

class SprintController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sprints = await sprintService.findAll();
      reply.send(sprints);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = SprintsIdSchema.parse(request.params);
    try {
      const sprint = await sprintService.findById(id);
      reply.send(sprint);
    } catch (error) {
      reply.status(404).send({ message: error });
    }
  }

  async newSprint(
    request: FastifyRequest<{ Body: ToSprintsDto }>,
    reply: FastifyReply
  ) {
    const toSprintsDto = request.body;
    try {
      const sprint = await sprintService.newSprint(toSprintsDto);
      reply.send(sprint);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async updateSprint(
    request: FastifyRequest<{
      Params: { id: number };
      Body: Partial<ToSprintsDto>;
    }>,
    reply: FastifyReply
  ) {
    const toSprintsDto = request.body;
    const { id } = SprintsIdSchema.parse(request.params);
    try {
      const updatedSprint = await sprintService.updateSprint(id, toSprintsDto);
      reply.send(updatedSprint);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async deleteSprint(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = SprintsIdSchema.parse(request.params);
    try {
      const sprint = await sprintService.deleteSprint(id);
      reply.send(sprint);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }
}

export default new SprintController();
