import { FastifyInstance } from "fastify";
import contribuicaoController from "./contribuicaoSistemica.controller";

export default async function contribuicaoSistemicaRoutes(
  app: FastifyInstance
) {
  app.get("/contribuicao-sistemica", contribuicaoController.findAll);
  app.get("/contribuicao-sistemica/:id", contribuicaoController.findById);
  app.post("/contribuicao-sistemica", contribuicaoController.create);
  app.put("/contribuicao-sistemica/:id", contribuicaoController.update);
  app.delete("/contribuicao-sistemica/:id", contribuicaoController.delete);
}
