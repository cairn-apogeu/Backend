import { FastifyInstance } from "fastify";
import cardProgressionController from "./cardProgression.controller";

const TAG = "Card Progression";

export default async function cardProgressionRoutes(app: FastifyInstance) {
  app.get(
    "/card-progressions",
    { schema: { tags: [TAG] } },
    cardProgressionController.findAll
  );
  app.get(
    "/card-progressions/:id",
    { schema: { tags: [TAG] } },
    cardProgressionController.findById
  );
  app.get(
    "/card-progressions/card/:cardId",
    { schema: { tags: [TAG] } },
    cardProgressionController.findByCard
  );
  app.post(
    "/card-progressions",
    { schema: { tags: [TAG] } },
    cardProgressionController.create
  );
  app.put(
    "/card-progressions/:id",
    { schema: { tags: [TAG] } },
    cardProgressionController.update
  );
  app.delete(
    "/card-progressions/:id",
    { schema: { tags: [TAG] } },
    cardProgressionController.delete
  );
}
