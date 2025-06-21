import { FastifyRequest, FastifyReply } from "fastify";
import sprintService from "./sprints.service";
import { SprintsIdSchema } from "./schemas/sprints-id.schema";
import { ToSprintsDto, ToSprintsSchema } from "./schemas/to-sprints.schema";
import { ZodError } from 'zod';
import { UpdateSprints, UpdateSprintsSchema } from "./schemas/update-sprints.schema";

class SprintController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sprints = await sprintService.findAll();
      reply.send(sprints);
      console.log("get:  ", sprints);
      
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      const validId = SprintsIdSchema.parse({ id });
      // Recupera o userId do request (adicionado pelo preHandler)
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated' });
      }
      const sprint = await sprintService.findById(validId.id, userId);
      if (!sprint) {
        return reply.status(404).send({ message: 'Not found' });
      }
      reply.send(sprint);
    } catch (error) {
      reply.status(400).send({ message: error || 'Validation error' });
    }
  }
  

  async newSprint(
    request: FastifyRequest<{ Body: ToSprintsDto }>,
    reply: FastifyReply
  ) {
    try {
      const toSprintsDto = ToSprintsSchema.parse(request.body);
      const sprint = await sprintService.newSprint(toSprintsDto);
      reply.send(sprint);
    } catch (error) {
      if (error instanceof ZodError) {
        // Se o erro for de validação do Zod, retorna 400 com a mensagem personalizada
        return reply.status(400).send({ message: 'Validation error' });
      }
      reply.status(500).send({ message: error });
    }
  }

  async updateSprint(
    request: FastifyRequest<{
      Params: { id: string }; // O parâmetro é recebido como string
      Body: Partial<UpdateSprints>;
    }>,
    reply: FastifyReply
  ) {
    try {
      // Convertendo o id para número
      const id = Number(request.params.id);
  
      // Obtendo o corpo da requisição
      const toSprintsDto = UpdateSprintsSchema.parse(request.body);
      
      // Atualizando o sprint
      const updatedSprint = await sprintService.updateSprint(id, toSprintsDto);
      if (!updatedSprint) {
        // Retorna 404 se o sprint não for encontrado
        return reply.status(404).send({ message: 'Sprint not found' });
      }
      reply.send(updatedSprint);
      
    } catch (error) {
      if (error instanceof ZodError) {
        // Se o erro for de validação do Zod, retorna 400 com a mensagem personalizada
        return reply.status(400).send({ message: 'Validation error' });
      }
      
      console.log(error);
      reply.status(500).send({ message: error || 'Internal Server Error' });
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

  async findAllByProjetoId(
    request: FastifyRequest<{ Params: { id_projeto: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id_projeto = Number(request.params.id_projeto);
      if (isNaN(id_projeto)) {
        return reply.status(400).send({ message: "id_projeto inválido" });
      }
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated' });
      }
      const sprints = await sprintService.findAllByProjetoId(id_projeto, userId);
      reply.send(sprints);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }
}

export default new SprintController();
