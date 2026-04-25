import { FastifyInstance } from "fastify";
import capacidadeController from "./capacidadeCognitivaAplicada.controller";

const TAG = "Capacidade Cognitiva Aplicada";

export default async function capacidadeCognitivaAplicadaRoutes(
  app: FastifyInstance
) {
  app.get(
    "/capacidade-cognitiva",
    { schema: { tags: [TAG] } },
    capacidadeController.findAll
  );
  app.get(
    "/capacidade-cognitiva/:id",
    { schema: { tags: [TAG] } },
    capacidadeController.findById
  );
  app.get(
    "/capacidade-cognitiva/sprint/:sprintId",
    { schema: { tags: [TAG] } },
    capacidadeController.findBySprint
  );
  app.get(
    "/capacidade-cognitiva/projeto/:projectId",
    { schema: { tags: [TAG] } },
    capacidadeController.findByProject
  );
  app.get(
    "/capacidade-cognitiva/usuario/:userId",
    { schema: { tags: [TAG] } },
    capacidadeController.findByUser
  );
  app.post(
    "/capacidade-cognitiva",
    { schema: { tags: [TAG] } },
    capacidadeController.create
  );
  app.put(
    "/capacidade-cognitiva/:id",
    { schema: { tags: [TAG] } },
    capacidadeController.update
  );
  app.delete(
    "/capacidade-cognitiva/:id",
    { schema: { tags: [TAG] } },
    capacidadeController.delete
  );
}
