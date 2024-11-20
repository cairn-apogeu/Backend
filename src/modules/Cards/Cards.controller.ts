import { FastifyRequest, FastifyReply } from 'fastify';
import cardsService from './Cards.service';
import  { CardsDto, CardsSchema } from './schemas/create-Cards.schema';
import { CardsUpdateSchema } from './schemas/update-Cards.schema';  
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

  async create(request: FastifyRequest<{ Body: CardsDto }>, reply: FastifyReply) {
    try {
      console.log("Request body recebido:", request.body);
      const createCardDto = CardsSchema.parse(request.body);
      const newCard = await cardsService.create(createCardDto);
      reply.code(201).send(newCard);
    } catch (error: any) {
      console.error("Erro ao criar o card:", error);
      reply.status(500).send({ message: error.message || "Erro interno do servidor" });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: Partial<CardsDto> }>, reply: FastifyReply) {
    const { id } = request.params;
    const updateCardDto = CardsUpdateSchema.parse(request.body);  
    try {
      const updatedCard = await cardsService.update(id, updateCardDto);
      reply.send(updatedCard);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await cardsService.delete(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByAssignedUser(request: FastifyRequest<{ Params: { userId: number } }>, reply: FastifyReply) {
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
}

export default new CardsController();
