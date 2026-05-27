import { FastifyInstance } from "fastify";
import AiUsageTrackingController from "./aiUsageTracking.controller";

async function aiUsageTrackingRoutes(fastify: FastifyInstance) {
  fastify.post("/ai-usage-tracking", AiUsageTrackingController.create);
  fastify.get("/ai-usage-tracking/me", AiUsageTrackingController.findByUser);
  fastify.get("/ai-usage-tracking/:id", AiUsageTrackingController.findById);
  fastify.put("/ai-usage-tracking/:id", AiUsageTrackingController.update);

  // Devin API integration endpoints
  fastify.post("/ai-usage-tracking/devin/sync", AiUsageTrackingController.syncDevinSessions);
  fastify.post("/ai-usage-tracking/devin/import", AiUsageTrackingController.importDevinPrompts);
  fastify.post("/ai-usage-tracking/devin/import-all", AiUsageTrackingController.importAllDevinSessions);
}

export default aiUsageTrackingRoutes;
