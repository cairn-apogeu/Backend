import { FastifyInstance } from 'fastify';
import CardsController from './Cards.controller';

export default async function cardsRoutes(fastify: FastifyInstance) {
  const cardsController = new CardsController();

  fastify.get('/cards', cardsController.findAll.bind(cardsController));
  fastify.get('/cards/:id', cardsController.findById.bind(cardsController));
  fastify.post('/cards', cardsController.create.bind(cardsController));
  fastify.put('/cards/:id', cardsController.update.bind(cardsController));
  fastify.delete('/cards/:id', cardsController.delete.bind(cardsController));
  fastify.get('/cards/user/:userId', cardsController.findByAssignedUser.bind(cardsController));
  fastify.get('/cards/sprint/:sprintId', cardsController.findBySprint.bind(cardsController));
  fastify.get('/cards/project/:projectId', cardsController.findByProject.bind(cardsController));
}