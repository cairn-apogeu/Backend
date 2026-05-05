import { FastifyInstance } from "fastify";
import projetoController from "./projetos.controller";

const TAG = "Projetos";

export default async function projetoRoutes(app: FastifyInstance) {
  app.get("/projetos", { schema: { tags: [TAG] } }, projetoController.findAll);
  app.get(
    "/projetos/:id",
    { schema: { tags: [TAG] } },
    projetoController.findProjectById
  );
  app.get(
    "/projetos/dev/:id",
    { schema: { tags: [TAG] } },
    projetoController.findProjectByUserId
  );
  app.post("/projetos", { schema: { tags: [TAG] } }, projetoController.newProjeto);
  app.put(
    "/projetos/:id",
    { schema: { tags: [TAG] } },
    projetoController.updateProjeto
  );
  app.delete(
    "/projetos/:id",
    { schema: { tags: [TAG] } },
    projetoController.deleteProjeto
  );
  app.get(
    "/projetos/:id/github-content",
    { schema: { tags: [TAG] } },
    projetoController.fetchGithubContent
  );
}
