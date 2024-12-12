import { FastifyRequest, FastifyReply } from "fastify";
import projetoService from "./projetos.service";
import { ProjetosParamsIdSchema } from "./schemas/projetos-id.schema";
import { ToProjetosDto } from "./schemas/to-projetos.schema";

class ProjetoController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const projetos = await projetoService.findAll();
      reply.send(projetos);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findProjectById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = ProjetosParamsIdSchema.parse(request.params);
    console.log(id);
    try {
      const projeto = await projetoService.findById(Number(id));
      reply.send(projeto);
    } catch (error) {
      console.log("Erro no controller", error);
      reply.status(404).send({ Message: error });
    }
  }

  async newProjeto(
    request: FastifyRequest<{ Body: ToProjetosDto }>,
    reply: FastifyReply
  ) {
    const toProjetosDto = request.body;
    try {
      const projeto = await projetoService.newProjeto(toProjetosDto);
      reply.send(projeto);
    } catch (error) {
      reply.status(500).send({ Message: error });
    }
  }

  async updateProjeto(
    request: FastifyRequest<{
      Params: { id: number };
      Body: Partial<ToProjetosDto>;
    }>,
    reply: FastifyReply
  ) {
    const toProjetosDto = request.body;
    const { id } = ProjetosParamsIdSchema.parse(request.params);
    try {
      const newProjeto = await projetoService.updateProjeto(
        Number(id),
        toProjetosDto
      );
      reply.send(newProjeto);
    } catch (error) {
      reply.status(500).send({ Message: error });
    }
  }

  async deleteProjeto(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = ProjetosParamsIdSchema.parse(request.params);
    try {
      const projeto = await projetoService.deleteProjeto(Number(id));
      reply.send(projeto);
    } catch (error) {
      reply.status(500).send({ Message: error });
    }
  }
}

export default new ProjetoController();
