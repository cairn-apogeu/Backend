import { FastifyInstance } from "fastify";
import cardsController from "./cards.controller";

export default async function cardsRoutes(app: FastifyInstance) {
  app.put("/cards/position/:id", cardsController.alteraPosicao);
}
