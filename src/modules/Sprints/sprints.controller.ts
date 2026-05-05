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
        console.log("Erro de validação:", error.errors);
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
      console.log("Atualizando sprint com os dados:", request.body);
      const id = Number(request.params.id);
      const validId = SprintsIdSchema.parse({ id });
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: "User not authenticated" });
      }
  
      const toSprintsDto = UpdateSprintsSchema.parse(request.body);
      
      const updatedSprint = await sprintService.updateSprint(
        validId.id,
        toSprintsDto,
        userId
      );
      reply.send(updatedSprint);
      
    } catch (error: any) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Validation error' });
      }
      const message = error?.message ?? "Internal Server Error";
      console.log(error);
      if (message.includes("não encontrada")) {
        return reply.status(404).send({ message: "Sprint not found" });
      }
      if (message.includes("Acesso negado")) {
        return reply.status(403).send({ message });
      }
      reply.status(500).send({ message });
    }
  }

  async deleteSprint(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      const validId = SprintsIdSchema.parse({ id });
      const userId = (request as any).userId;
      if (!userId) {
        return reply.status(401).send({ message: "User not authenticated" });
      }

      const sprint = await sprintService.deleteSprint(validId.id, userId);
      reply.send(sprint);
    } catch (error: any) {
      const message = error?.message ?? "Internal Server Error";
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error" });
      }
      if (message.includes("não encontrada")) {
        return reply.status(404).send({ message: "Sprint not found" });
      }
      if (message.includes("Acesso negado")) {
        return reply.status(403).send({ message });
      }
      reply.status(500).send({ message });
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
