import { FastifyRequest, FastifyReply } from 'fastify';
import cardsService from './Cards.service';

class CardsController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const cards = await cardsService.findAll();
      reply.send(cards);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const card = await cardsService.findById(id);
      reply.send(card);
    } catch (error) {
      reply.status(404).send({ message: error });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const card = await cardsService.create(request.body);
      reply.send(card);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const card = await cardsService.update(id, request.body);
      reply.send(card);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await cardsService.delete(id);
      reply.send({ message: 'Card deleted successfully' });
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByAssignedUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const { userId } = request.params;
    try {
      const cards = await cardsService.findByAssignedUser(userId);
      reply.send(cards);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findBySprint(request: FastifyRequest<{ Params: { sprintId: number } }>, reply: FastifyReply) {
    const { sprintId } = request.params;
    try {
      const cards = await cardsService.findBySprint(sprintId);
      reply.send(cards);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByProject(request: FastifyRequest<{ Params: { projectId: string } }>, reply: FastifyReply) {
    const projectIdParam = request.params.projectId;
    const projectId = Number(projectIdParam);

    // Validação do projectId
    if (isNaN(projectId)) {
      console.error(`projectId inválido: ${projectIdParam}`);
      reply.status(400).send({ message: "projectId inválido fornecido." });
      return;
    }

    try {
      const cards = await cardsService.findByProject(projectId);
      reply.send(cards);
    } catch (error) {
      console.error("Erro ao buscar cards por projeto:", error);
      reply.status(500).send({ message: "Erro interno no servidor" });
    }
  }
}

export default CardsController;