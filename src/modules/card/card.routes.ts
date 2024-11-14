import { FastifyInstance } from 'fastify';
import cardController from './card.controller';

export default async function cardRoutes(app: FastifyInstance) {
    app.get('/cards/sprint/:sprintId', cardController.findBySprint);
}