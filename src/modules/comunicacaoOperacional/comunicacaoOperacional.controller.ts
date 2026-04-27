import { FastifyReply, FastifyRequest } from "fastify";
import comunicacaoService from "./comunicacaoOperacional.service";
import {
  ComunicacaoOperacionalDto,
  ComunicacaoOperacionalSchema,
  ComunicacaoOperacionalUpdateSchema,
} from "./schemas/comunicacaoOperacional.schema";
import { ZodError } from "zod";

class ComunicacaoOperacionalController {
  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await comunicacaoService.findAll();
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
      const record = await comunicacaoService.findById(id);
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
      const records = await comunicacaoService.findBySprint(sprintId);
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
      const records = await comunicacaoService.findByProject(projectId);
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
      const records = await comunicacaoService.findByUser(userId);
      reply.send(records);
    } catch (error) {
      reply
        .status(500)
        .send({ message: "Falha ao listar registros do usuário", error });
    }
  }

  async create(
    request: FastifyRequest<{ Body: ComunicacaoOperacionalDto }>,
    reply: FastifyReply
  ) {
    try {
      const payload = ComunicacaoOperacionalSchema.parse(request.body);
      const record = await comunicacaoService.create(payload);
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
      Body: Partial<ComunicacaoOperacionalDto>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const payload = ComunicacaoOperacionalUpdateSchema.parse(request.body);
      const record = await comunicacaoService.update(id, payload);
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
      await comunicacaoService.delete(id);
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

export default new ComunicacaoOperacionalController();
