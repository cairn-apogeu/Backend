import { FastifyReply, FastifyRequest } from "fastify";
import execucaoService from "./execucaoConfiavel.service";
import {
  ExecucaoConfiavelDto,
  ExecucaoConfiavelSchema,
  ExecucaoConfiavelUpdateSchema,
} from "./schemas/execucaoConfiavel.schema";
import { ZodError } from "zod";

class ExecucaoConfiavelController {
  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await execucaoService.findAll();
      reply.send(records);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao listar registros", error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const record = await execucaoService.findById(id);
      if (!record) {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply.send(record);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao buscar registro", error });
    }
  }

  async findBySprint(
    request: FastifyRequest<{ Params: { sprintId: string } }>,
    reply: FastifyReply
  ) {
    const sprintId = Number(request.params.sprintId);
    if (Number.isNaN(sprintId)) {
      return reply.status(400).send({ message: "ID da sprint inválido" });
    }
    try {
      const records = await execucaoService.findBySprint(sprintId);
      reply.send(records);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao listar registros da sprint", error });
    }
  }

  async findByProject(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
  ) {
    const projectId = Number(request.params.projectId);
    if (Number.isNaN(projectId)) {
      return reply.status(400).send({ message: "ID do projeto inválido" });
    }
    try {
      const records = await execucaoService.findByProject(projectId);
      reply.send(records);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao listar registros do projeto", error });
    }
  }

  async findByUser(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    if (!userId) {
      return reply.status(400).send({ message: "ID do usuário é obrigatório" });
    }
    try {
      const records = await execucaoService.findByUser(userId);
      reply.send(records);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao listar registros do usuário", error });
    }
  }

  async create(
    request: FastifyRequest<{ Body: ExecucaoConfiavelDto }>,
    reply: FastifyReply
  ) {
    try {
      const payload = ExecucaoConfiavelSchema.parse(request.body);
      const record = await execucaoService.create(payload);
      reply.code(201).send(record);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Dados inválidos", error });
      }
      reply.status(500).send({ message: "Falha ao criar registro", error });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<ExecucaoConfiavelDto>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const payload = ExecucaoConfiavelUpdateSchema.parse(request.body);
      const record = await execucaoService.update(id, payload);
      reply.send(record);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Dados inválidos", error });
      }
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply
        .status(500)
        .send({
          message: "Falha ao atualizar registro",
          error: error?.message || error,
        });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      await execucaoService.delete(id);
      reply.status(204).send();
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Registro não encontrado" });
      }
      reply
        .status(500)
        .send({
          message: "Falha ao remover registro",
          error: error?.message || error,
        });
    }
  }
}

export default new ExecucaoConfiavelController();
