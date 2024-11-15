import { FastifyRequest, FastifyReply } from "fastify";
import CardsService from "./cards.service";
import {
  UpdatePositionDto,
  UpdatePositionSchema,
} from "./schemas/update-position.schema";
import { CardsIdDto, CardsIdSchema } from "./schemas/cards-id.schema";
import cardsService from "./cards.service";

class CardsController {
  async alteraPosicao(
    request: FastifyRequest<{
      Params: { id: number };
      Body: { updatePositionDto: UpdatePositionDto };
    }>,
    reply: FastifyReply
  ) {
    const { id } = CardsIdSchema.parse(request.params);
    const updateCardsSchema = UpdatePositionSchema.parse(request.body);
    try {
      const updatePosition = await cardsService.alterarPosicao(
        id,
        updateCardsSchema
      );
      reply.send(updatePosition);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao alterar posição" });
    }
  }
}

export default new CardsController();
