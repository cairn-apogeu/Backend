import { FastifyInstance } from 'fastify';
import * as controller from './devProjetos.controller';

const TAG = 'Dev Projetos';

export default async function devProjetosRoutes(app: FastifyInstance) {
  app.get('/dev-projetos', { schema: { tags: [TAG] } }, controller.getAll);
  app.get('/dev-projetos/:projeto_id', { schema: { tags: [TAG] } }, controller.getByProjetoId);
  app.post('/dev-projetos', { schema: { tags: [TAG] } }, controller.create);
  app.delete('/dev-projetos/:projeto_id/:dev_id', { schema: { tags: [TAG] } }, controller.remove);
}
