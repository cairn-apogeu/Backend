import { FastifyRequest, FastifyReply } from 'fastify';
import * as alunoProjetosService from './alunoProjetos.service'

export const getAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = await alunoProjetosService.getAll();
  reply.send(result);
};

export const getByProjetoId = async (request: FastifyRequest<{ Params: { projeto_id: string } }>, reply: FastifyReply) => {
  const { projeto_id } = request.params;
  const result = await alunoProjetosService.getByProjetoId(Number(projeto_id));
  if (!result || result.length === 0) return reply.status(404).send({ message: 'Not found' });
  reply.send(result);
};

export const create = async (request: FastifyRequest<{ Body: { projeto_id: number; aluno_id: string } }>, reply: FastifyReply) => {
  const data = request.body;
  const result = await alunoProjetosService.create(data);
  reply.status(201).send(result);
};

export const remove = async (request: FastifyRequest<{ Params: { projeto_id: string; aluno_id: string } }>, reply: FastifyReply) => {
  const { projeto_id, aluno_id } = request.params;
  await alunoProjetosService.remove(Number(projeto_id), aluno_id);
  reply.status(204).send();
};
