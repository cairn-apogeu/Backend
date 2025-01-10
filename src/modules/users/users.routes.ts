import { FastifyInstance } from "fastify";
import userController from "./users.controller";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/users", userController.findAll);
  app.get("/users/:id", userController.findById);
  app.get("/users/project/:id", userController.findUserbyProjectId); 
  app.post("/users", userController.newUser);
  app.put("/users/:id", userController.updateUser);
  app.delete("/users/:id", userController.deleteUser);
}
