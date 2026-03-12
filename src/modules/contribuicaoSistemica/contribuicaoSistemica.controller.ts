import { FastifyReply, FastifyRequest } from "fastify";
import contribuicaoService from "./contribuicaoSistemica.service";
import {
  ContribuicaoSistemicaDto,
  ContribuicaoSistemicaSchema,
  ContribuicaoSistemicaUpdateSchema,
} from "./schemas/contribuicaoSistemica.schema";
import { ZodError } from "zod";

class ContribuicaoSistemicaController {
  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const records = await contribuicaoService.findAll();
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
      const record = await contribuicaoService.findById(id);
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

  async create(
    request: FastifyRequest<{ Body: ContribuicaoSistemicaDto }>,
    reply: FastifyReply
  ) {
    try {
      const payload = ContribuicaoSistemicaSchema.parse(request.body);
      const record = await contribuicaoService.create(payload);
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
      Body: Partial<ContribuicaoSistemicaDto>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "ID inválido" });
      }
      const payload = ContribuicaoSistemicaUpdateSchema.parse(request.body);
      const record = await contribuicaoService.update(id, payload);
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
      await contribuicaoService.delete(id);
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

export default new ContribuicaoSistemicaController();
