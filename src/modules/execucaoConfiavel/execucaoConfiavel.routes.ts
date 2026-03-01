import { FastifyInstance } from "fastify";
import execucaoController from "./execucaoConfiavel.controller";

export default async function execucaoConfiavelRoutes(app: FastifyInstance) {
  app.get("/execucao-confiavel", execucaoController.findAll);
  app.get("/execucao-confiavel/:id", execucaoController.findById);
  app.post("/execucao-confiavel", execucaoController.create);
  app.put("/execucao-confiavel/:id", execucaoController.update);
  app.delete("/execucao-confiavel/:id", execucaoController.delete);
}
