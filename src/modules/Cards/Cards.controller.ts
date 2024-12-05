// src/controllers/Cards.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import cardsService from './Cards.service';
import { CardsDto, CardsSchema } from './schemas/create-Cards.schema';
import { CardsUpdateSchema } from './schemas/update-Cards.schema';

class CardsController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const cards = await cardsService.findAll();
      reply.send(cards);
    } catch (error) {
      console.error("Erro ao recuperar os cards:", error);
      reply.status(500).send({ message: (error as Error).message });
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const card = await cardsService.findById(id);
      reply.send(card);
    } catch (error) {
      console.error(`Erro ao encontrar o card com ID ${id}:`, error);
      reply.status(404).send({ message: (error as Error).message });
    }
  }

  async create(request: FastifyRequest<{ Body: CardsDto }>, reply: FastifyReply) {
    try {
      console.log("Recebendo dados para criação de card:", request.body);
      const createCardDto = CardsSchema.parse(request.body);
      const newCard = await cardsService.create(createCardDto);
      console.log("Card criado com sucesso:", newCard);
      reply.code(201).send(newCard);
    } catch (error: any) {
      console.error("Erro ao criar card:", error);
      reply.status(500).send({ message: error.message || "Erro interno do servidor" });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: Partial<CardsDto> }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      console.log(`Recebendo dados para atualizar o card com ID ${id}:`, request.body);
      const updateCardDto = CardsUpdateSchema.parse(request.body);
      const updatedCard = await cardsService.update(id, updateCardDto);
      console.log("Card atualizado com sucesso:", updatedCard);
      reply.send(updatedCard);
    } catch (error) {
      console.error(`Erro ao atualizar card com ID ${id}:`, error);
      reply.status(500).send({ message: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await cardsService.delete(id);
      console.log(`Card com ID ${id} deletado com sucesso`);
      reply.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar card com ID ${id}:`, error);
      reply.status(500).send({ message: (error as Error).message });
    }
  }

  async findByAssignedUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const { userId } = request.params;
    try {
      const cards = await cardsService.findByAssignedUser(userId);
      reply.send(cards);
    } catch (error) {
      console.error(`Erro ao recuperar os cards atribuídos ao usuário ${userId}:`, error);
      reply.status(500).send({ message: (error as Error).message });
    }
  }

  async findBySprint(request: FastifyRequest<{ Params: { sprintId: number } }>, reply: FastifyReply) {
    const { sprintId } = request.params;
    try {
      const cards = await cardsService.findBySprint(sprintId);
      reply.send(cards);
    } catch (error) {
      console.error(`Erro ao recuperar os cards para o sprint ${sprintId}:`, error);
      reply.status(500).send({ message: (error as Error).message });
    }
  }
}

export default new CardsController();