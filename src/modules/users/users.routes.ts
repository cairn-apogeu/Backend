import { FastifyInstance } from "fastify";
import userController from "./users.controller";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/users", userController.findAll);
  app.get("/users/:id", userController.findById);
  app.post("/users", userController.newUser);
  app.put("/users/:id", userController.updateUser);
  app.delete("/users/:id", userController.deleteUser);
}
