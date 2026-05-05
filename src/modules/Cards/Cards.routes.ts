import { FastifyInstance } from 'fastify';
import CardsController from './Cards.controller';

const TAG = 'Cards';

async function cardsRoutes(fastify: FastifyInstance) {
  fastify.get('/cards', { schema: { tags: [TAG] } }, CardsController.findAll);
  fastify.get('/cards/:id', { schema: { tags: [TAG] } }, CardsController.findById);
  fastify.post('/cards', { schema: { tags: [TAG] } }, CardsController.create);
  fastify.put('/cards/:id', { schema: { tags: [TAG] } }, CardsController.update);
  fastify.delete('/cards/:id', { schema: { tags: [TAG] } }, CardsController.delete);
  fastify.get('/cards/assigned/:userId', { schema: { tags: [TAG] } }, CardsController.findByAssignedUser);
  fastify.get('/cards/sprint/:sprintId', { schema: { tags: [TAG] } }, CardsController.findBySprint);
  fastify.get('/cards/project/:projectId', { schema: { tags: [TAG] } }, CardsController.findByProject);
  fastify.post('/cards/compute-xp/:projectId', { schema: { tags: [TAG] } }, CardsController.computeXpByProject);
  fastify.post('/cards/compute-xp-sprint/:sprintId', { schema: { tags: [TAG] } }, CardsController.computeXpBySprint);
  fastify.get('/cards/status-timeline/project/:projectId', { schema: { tags: [TAG] } }, CardsController.statusTimelineByProject);
  fastify.get('/cards/status-timeline/sprint/:sprintId', { schema: { tags: [TAG] } }, CardsController.statusTimelineBySprint);
}

export default cardsRoutes;
