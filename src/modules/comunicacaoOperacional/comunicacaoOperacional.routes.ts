import { FastifyInstance } from "fastify";
import comunicacaoController from "./comunicacaoOperacional.controller";

const TAG = "Comunicação Operacional";

export default async function comunicacaoOperacionalRoutes(
  app: FastifyInstance
) {
  app.get(
    "/comunicacao-operacional",
    { schema: { tags: [TAG] } },
    comunicacaoController.findAll
  );
  app.get(
    "/comunicacao-operacional/:id",
    { schema: { tags: [TAG] } },
    comunicacaoController.findById
  );
  app.get(
    "/comunicacao-operacional/sprint/:sprintId",
    { schema: { tags: [TAG] } },
    comunicacaoController.findBySprint
  );
  app.get(
    "/comunicacao-operacional/projeto/:projectId",
    { schema: { tags: [TAG] } },
    comunicacaoController.findByProject
  );
  app.get(
    "/comunicacao-operacional/usuario/:userId",
    { schema: { tags: [TAG] } },
    comunicacaoController.findByUser
  );
  app.post(
    "/comunicacao-operacional",
    { schema: { tags: [TAG] } },
    comunicacaoController.create
  );
  app.put(
    "/comunicacao-operacional/:id",
    { schema: { tags: [TAG] } },
    comunicacaoController.update
  );
  app.delete(
    "/comunicacao-operacional/:id",
    { schema: { tags: [TAG] } },
    comunicacaoController.delete
  );
}
