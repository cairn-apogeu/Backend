import { FastifyInstance } from "fastify";
import comunicacaoController from "./comunicacaoOperacional.controller";

export default async function comunicacaoOperacionalRoutes(
  app: FastifyInstance
) {
  app.get("/comunicacao-operacional", comunicacaoController.findAll);
  app.get("/comunicacao-operacional/:id", comunicacaoController.findById);
  app.post("/comunicacao-operacional", comunicacaoController.create);
  app.put("/comunicacao-operacional/:id", comunicacaoController.update);
  app.delete("/comunicacao-operacional/:id", comunicacaoController.delete);
}
