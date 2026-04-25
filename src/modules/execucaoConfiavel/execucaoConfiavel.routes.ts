import { FastifyInstance } from "fastify";
import execucaoController from "./execucaoConfiavel.controller";

const TAG = "Execução Confiável";

export default async function execucaoConfiavelRoutes(app: FastifyInstance) {
  app.get(
    "/execucao-confiavel",
    { schema: { tags: [TAG] } },
    execucaoController.findAll
  );
  app.get(
    "/execucao-confiavel/:id",
    { schema: { tags: [TAG] } },
    execucaoController.findById
  );
  app.get(
    "/execucao-confiavel/sprint/:sprintId",
    { schema: { tags: [TAG] } },
    execucaoController.findBySprint
  );
  app.get(
    "/execucao-confiavel/projeto/:projectId",
    { schema: { tags: [TAG] } },
    execucaoController.findByProject
  );
  app.get(
    "/execucao-confiavel/usuario/:userId",
    { schema: { tags: [TAG] } },
    execucaoController.findByUser
  );
  app.post(
    "/execucao-confiavel",
    { schema: { tags: [TAG] } },
    execucaoController.create
  );
  app.put(
    "/execucao-confiavel/:id",
    { schema: { tags: [TAG] } },
    execucaoController.update
  );
  app.delete(
    "/execucao-confiavel/:id",
    { schema: { tags: [TAG] } },
    execucaoController.delete
  );
}
