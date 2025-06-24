import { FastifyInstance } from 'fastify';
import * as controller from './alunoProjetos.controller';

export default async function alunoProjetosRoutes(app: FastifyInstance) {
  app.get('/aluno-projetos', controller.getAll);
  app.get('/aluno-projetos/:projeto_id', controller.getByProjetoId);
  app.post('/aluno-projetos', controller.create);
  app.delete('/aluno-projetos/:projeto_id/:aluno_id', controller.remove);
}
