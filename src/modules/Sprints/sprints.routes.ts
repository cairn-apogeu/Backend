import { FastifyInstance } from "fastify";
import sprintController from "./sprints.controller";

export default async function sprintRoutes(app: FastifyInstance) {
  app.get("/sprints", sprintController.findAll);
  app.get("/sprints/:id", sprintController.findById);
  app.post("/sprints", sprintController.newSprint);
  app.put("/sprints/:id", sprintController.updateSprint);
  app.delete("/sprints/:id", sprintController.deleteSprint);
}
