import { FastifyRequest, FastifyReply } from "fastify";
import sprintService from "./sprints.service";
import { SprintsIdSchema } from "./schemas/sprints-id.schema";
import { ToSprintsDto, ToSprintsSchema } from "./schemas/to-sprints.schema";
import { ZodError } from 'zod';

class SprintController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sprints = await sprintService.findAll();
      reply.send(sprints);
      console.log(sprints);
      
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      // Converta o id para número antes da validação
      const id = Number(request.params.id);
  
      // Validação com Zod após a conversão
      const validId = SprintsIdSchema.parse({ id });
  
      // Chamada do serviço com o ID validado
      const sprint = await sprintService.findById(validId.id);
  
      if (!sprint) {
        // Caso o serviço não retorne um sprint válido
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
      Body: Partial<ToSprintsDto>;
    }>,
    reply: FastifyReply
  ) {
    try {
      // Convertendo o id para número
      const id = Number(request.params.id);
  
      // Obtendo o corpo da requisição
      const toSprintsDto = ToSprintsSchema.parse(request.body);
  
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
}

export default new SprintController();
