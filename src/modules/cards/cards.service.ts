import prisma from "../../clients/prisma.client";
import { UpdatePositionDto } from "./schemas/update-position.schema";

class CardsService {
  async alterarPosicao(id: number, updatePositionDto: UpdatePositionDto) {
    try {
      const cardAtualizado = await prisma.cards.update({
        where: { id },
        data: updatePositionDto,
      });

      return {
        message: "Posicao do card alterada com sucesso",
        cards: cardAtualizado,
      };
    } catch (error) {
      throw new Error(`Falha ao atualizar posição do card: ${error}`);
    }
  }
}

export default new CardsService();
