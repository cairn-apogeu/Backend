import { FastifyInstance } from "fastify";
import statisticsController from "./statistics.controller";

const TAG = "Statistics";

export default async function statisticsRoutes(app: FastifyInstance) {
  app.get("/statistics", { schema: { tags: [TAG] } }, statisticsController.findAll);
  app.get(
    "/statistics/:user_clerk_id",
    { schema: { tags: [TAG] } },
    statisticsController.findByUserId
  );
  app.post(
    "/statistics/:user_clerk_id",
    { schema: { tags: [TAG] } },
    statisticsController.create
  );
  app.put(
    "/statistics/:user_clerk_id",
    { schema: { tags: [TAG] } },
    statisticsController.update
  );
  app.delete(
    "/statistics/:user_clerk_id",
    { schema: { tags: [TAG] } },
    statisticsController.delete
  );
}
