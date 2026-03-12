import { FastifyInstance } from "fastify";
import dailyController from "./daily.controller";

export default async function dailyRoutes(app: FastifyInstance) {
  app.get("/daily", dailyController.findAll);
  app.get("/daily/:id", dailyController.findById);
  app.get("/daily/projeto/:projetoId", dailyController.findByProjeto);
  app.get("/daily/sprint/:sprintId", dailyController.findBySprint);
  app.post("/daily", dailyController.create);
  app.put("/daily/:id", dailyController.update);
  app.delete("/daily/:id", dailyController.delete);
}
