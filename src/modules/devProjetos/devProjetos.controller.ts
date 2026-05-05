import { FastifyRequest, FastifyReply } from 'fastify';
import * as devProjetosService from './devProjetos.service'

export const getAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = await devProjetosService.getAll();
  reply.send(result);
};

export const getByProjetoId = async (request: FastifyRequest<{ Params: { projeto_id: string } }>, reply: FastifyReply) => {
  const { projeto_id } = request.params;
  const result = await devProjetosService.getByProjetoId(Number(projeto_id));
  if (!result || result.length === 0) return reply.status(404).send({ message: 'Not found' });
  reply.send(result);
};

export const create = async (request: FastifyRequest<{ Body: { projeto_id: number; dev_id: string } }>, reply: FastifyReply) => {
  const data = request.body;
  const result = await devProjetosService.create(data);
  reply.status(201).send(result);
};

export const remove = async (request: FastifyRequest<{ Params: { projeto_id: string; dev_id: string } }>, reply: FastifyReply) => {
  const { projeto_id, dev_id } = request.params;
  await devProjetosService.remove(Number(projeto_id), dev_id);
  reply.status(204).send();
};
