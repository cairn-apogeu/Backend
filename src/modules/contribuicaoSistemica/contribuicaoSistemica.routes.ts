import { FastifyInstance } from "fastify";
import contribuicaoController from "./contribuicaoSistemica.controller";

const TAG = "Contribuição Sistêmica";

export default async function contribuicaoSistemicaRoutes(
  app: FastifyInstance
) {
  app.get(
    "/contribuicao-sistemica",
    { schema: { tags: [TAG] } },
    contribuicaoController.findAll
  );
  app.get(
    "/contribuicao-sistemica/:id",
    { schema: { tags: [TAG] } },
    contribuicaoController.findById
  );
  app.get(
    "/contribuicao-sistemica/sprint/:sprintId",
    { schema: { tags: [TAG] } },
    contribuicaoController.findBySprint
  );
  app.get(
    "/contribuicao-sistemica/projeto/:projectId",
    { schema: { tags: [TAG] } },
    contribuicaoController.findByProject
  );
  app.get(
    "/contribuicao-sistemica/usuario/:userId",
    { schema: { tags: [TAG] } },
    contribuicaoController.findByUser
  );
  app.post(
    "/contribuicao-sistemica",
    { schema: { tags: [TAG] } },
    contribuicaoController.create
  );
  app.put(
    "/contribuicao-sistemica/:id",
    { schema: { tags: [TAG] } },
    contribuicaoController.update
  );
  app.delete(
    "/contribuicao-sistemica/:id",
    { schema: { tags: [TAG] } },
    contribuicaoController.delete
  );
}
