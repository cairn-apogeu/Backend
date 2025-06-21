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

      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated' });
      }

      const card = await cardsService.findById(id, userId);
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

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await cardsService.delete(Number(id));
      reply.status(200).send();
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
      const sprintId = Number(request.params.sprintId);
      if (isNaN(sprintId)) {
        return reply.status(400).send({ message: 'ID inválido. Deve ser um número válido.' });
      }
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated' });
      }
      const cards = await cardsService.findBySprint(sprintId, userId);
      reply.send(cards);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findByProject(request: FastifyRequest<{ Params: { projectId: number } }>, reply: FastifyReply) {
    try {
      const projectId = Number(request.params.projectId);
      if (isNaN(projectId)) {
        return reply.status(400).send({ message: 'ID inválido. Deve ser um número válido.' });
      }
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated' });
      }
      const cards = await cardsService.findByProject(projectId, userId);
      reply.send(cards);
    } catch (error) {
      reply.status(404).send({ message: error });
    }
  }

  async computeXpByProject(request: FastifyRequest<{ Params: { projectId: string } }>, reply: FastifyReply) {
    try {
      const projectId = Number(request.params.projectId);
      if (isNaN(projectId)) {
        return reply.status(400).send({ message: "ID do projeto inválido." });
      }
      await cardsService.computeXpForUncomputedCardsByProject(projectId);
      reply.send({ message: "XP computado para todos os cards não computados deste projeto." });
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async computeXpBySprint(request: FastifyRequest<{ Params: { sprintId: string } }>, reply: FastifyReply) {
    try {
      const sprintId = Number(request.params.sprintId);
      if (isNaN(sprintId)) {
        return reply.status(400).send({ message: "ID da sprint inválido." });
      }
      await cardsService.computeXpForUncomputedCardsBySprint(sprintId);
      reply.send({ message: "XP computado para todos os cards não computados desta sprint e sprint marcada como computada." });
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

}

export default new CardsController();
