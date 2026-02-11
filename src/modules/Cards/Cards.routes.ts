import { FastifyInstance } from 'fastify';
import CardsController from './Cards.controller';

async function cardsRoutes(fastify: FastifyInstance) {
  fastify.get('/cards', CardsController.findAll);
  fastify.get('/cards/:id', CardsController.findById);
  fastify.post('/cards', CardsController.create);
  fastify.put('/cards/:id', CardsController.update);
  fastify.delete('/cards/:id', CardsController.delete);
  fastify.get('/cards/assigned/:userId', CardsController.findByAssignedUser);
  fastify.get('/cards/sprint/:sprintId', CardsController.findBySprint);
  fastify.get('/cards/project/:projectId', CardsController.findByProject);
  fastify.post('/cards/compute-xp/:projectId', CardsController.computeXpByProject);
  fastify.post('/cards/compute-xp-sprint/:sprintId', CardsController.computeXpBySprint);
}

export default cardsRoutes;
