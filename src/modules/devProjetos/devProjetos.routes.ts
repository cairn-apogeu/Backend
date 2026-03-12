import { FastifyInstance } from 'fastify';
import * as controller from './devProjetos.controller';

export default async function devProjetosRoutes(app: FastifyInstance) {
  app.get('/dev-projetos', controller.getAll);
  app.get('/dev-projetos/:projeto_id', controller.getByProjetoId);
  app.post('/dev-projetos', controller.create);
  app.delete('/dev-projetos/:projeto_id/:dev_id', controller.remove);
}
