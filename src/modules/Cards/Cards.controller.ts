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
      const id = Number(request.params.id); // Converte para número
      if (isNaN(id)) {
        return reply.status(400).send({ message: 'ID inválido. Deve ser um número válido.' });
      }
       
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
    try {
      const { id } = request.params;
      const updateCardDto = CardsUpdateSchema.parse(request.body);  
      const updatedCard = await cardsService.update(Number(id), updateCardDto);
      reply.send(updatedCard);
      
    } catch (error) {
      
      reply.status(500).send({ message: error });
      console.log("update: ", error);

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
    try {
      const sprintId = Number(request.params.sprintId); // Converte para número
      if (isNaN(sprintId)) {
        return reply.status(400).send({ message: 'ID inválido. Deve ser um número válido.' });
      }
      const cards = await cardsService.findBySprint(sprintId);
      reply.send(cards);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByProject(request: FastifyRequest<{ Params: { projectId: number } }>, reply: FastifyReply) {
    try {
      const projectId = Number(request.params.projectId); // Converte para número
      if (isNaN(projectId)) {
        return reply.status(400).send({ message: 'ID inválido. Deve ser um número válido.' });
      }
       
      const card = await cardsService.findByProject(projectId);
      reply.send(card);
    } catch (error) {
      reply.status(404).send({ message: error });
    }
  }

}

export default new CardsController();
