import { FastifyInstance } from "fastify";
import capacidadeController from "./capacidadeCognitivaAplicada.controller";

export default async function capacidadeCognitivaAplicadaRoutes(
  app: FastifyInstance
) {
  app.get("/capacidade-cognitiva", capacidadeController.findAll);
  app.get("/capacidade-cognitiva/:id", capacidadeController.findById);
  app.post("/capacidade-cognitiva", capacidadeController.create);
  app.put("/capacidade-cognitiva/:id", capacidadeController.update);
  app.delete("/capacidade-cognitiva/:id", capacidadeController.delete);
}
