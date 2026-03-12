import { FastifyInstance } from "fastify";
import statisticsController from "./statistics.controller";

export default async function statisticsRoutes(app: FastifyInstance) {
  app.get("/statistics", statisticsController.findAll);
  app.get("/statistics/:user_clerk_id", statisticsController.findByUserId);
  app.post("/statistics/:user_clerk_id", statisticsController.create);
  app.put("/statistics/:user_clerk_id", statisticsController.update);
  app.delete("/statistics/:user_clerk_id", statisticsController.delete);
}
