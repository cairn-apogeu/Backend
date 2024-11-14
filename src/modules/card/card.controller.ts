import { FastifyRequest, FastifyReply } from 'fastify';
import cardService from './card.service';

class CardController {
    async findBySprint(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { sprintId } = request.params as { sprintId: string };
            const cards = await cardService.findBySprint(Number(sprintId));
            reply.send(cards);
        } catch (error) {
            reply.status(500).send({ message: 'Failed to fetch cards for the specified sprint' });
        }
    }
}

export default new CardController();