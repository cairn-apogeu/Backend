import { FastifyInstance } from "fastify";
import sprintController from "./sprints.controller";

const TAG = "Sprints";

export default async function sprintRoutes(app: FastifyInstance) {
  app.get("/sprints", { schema: { tags: [TAG] } }, sprintController.findAll);
  app.get("/sprints/:id", { schema: { tags: [TAG] } }, sprintController.findById);
  app.get(
    "/sprints/projeto/:id_projeto",
    { schema: { tags: [TAG] } },
    sprintController.findAllByProjetoId
  );
  app.post("/sprints", { schema: { tags: [TAG] } }, sprintController.newSprint);
  app.put("/sprints/:id", { schema: { tags: [TAG] } }, sprintController.updateSprint);
  app.delete("/sprints/:id", { schema: { tags: [TAG] } }, sprintController.deleteSprint);
}
