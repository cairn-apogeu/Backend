import { FastifyInstance } from "fastify";
import projetoController from "./projetos.controller";

export default async function projetoRoutes(app: FastifyInstance) {
  app.get("/projetos", projetoController.findAll);
  app.get("/projetos/:id", projetoController.findProjectById);
  app.post("/projetos", projetoController.newProjeto);
  app.put("/projetos/:id", projetoController.updateProjeto);
  app.delete("/projetos/:id", projetoController.deleteProjeto);
}
