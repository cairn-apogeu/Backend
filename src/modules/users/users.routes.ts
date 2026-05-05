import { FastifyInstance } from "fastify";
import userController from "./users.controller";

const TAG = "Users";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/users", { schema: { tags: [TAG] } }, userController.findAll);
  app.get("/users/:id", { schema: { tags: [TAG] } }, userController.findById);
  app.get(
    "/users/project/:id",
    { schema: { tags: [TAG] } },
    userController.findUserbyProjectId
  );
  app.post("/users", { schema: { tags: [TAG] } }, userController.newUser);
  app.put("/users/:id", { schema: { tags: [TAG] } }, userController.updateUser);
  app.delete("/users/:id", { schema: { tags: [TAG] } }, userController.deleteUser);
}
