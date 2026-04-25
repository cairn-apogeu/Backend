import { FastifyInstance } from "fastify";
import dailyController from "./daily.controller";

const TAG = "Daily";

export default async function dailyRoutes(app: FastifyInstance) {
  app.get("/daily", { schema: { tags: [TAG] } }, dailyController.findAll);
  app.get("/daily/:id", { schema: { tags: [TAG] } }, dailyController.findById);
  app.get(
    "/daily/projeto/:projetoId",
    { schema: { tags: [TAG] } },
    dailyController.findByProjeto
  );
  app.get(
    "/daily/sprint/:sprintId",
    { schema: { tags: [TAG] } },
    dailyController.findBySprint
  );
  app.post("/daily", { schema: { tags: [TAG] } }, dailyController.create);
  app.put("/daily/:id", { schema: { tags: [TAG] } }, dailyController.update);
  app.delete("/daily/:id", { schema: { tags: [TAG] } }, dailyController.delete);
}
