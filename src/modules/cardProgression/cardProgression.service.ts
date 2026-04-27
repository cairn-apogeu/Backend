import prisma from "../../clients/prisma.client";
import {
  CardProgressionDto,
  CardProgressionUpdateDto,
} from "./schemas/cardProgression.schema";

const includeRelations = {
  card: true,
  projeto: true,
  sprint: true,
};

class CardProgressionService {
  async findAll() {
    return prisma.cardProgression.findMany({ include: includeRelations });
  }

  async findById(id: number) {
    return prisma.cardProgression.findUnique({
      where: { id },
      include: includeRelations,
    });
  }

  async findByCard(cardId: number) {
    return prisma.cardProgression.findMany({
      where: { card_id: cardId },
      orderBy: { changed_at: "asc" },
      include: includeRelations,
    });
  }

  async create(data: CardProgressionDto) {
    return prisma.cardProgression.create({ data, include: includeRelations });
  }

  async update(id: number, data: CardProgressionUpdateDto) {
    return prisma.cardProgression.update({
      where: { id },
      data,
      include: includeRelations,
    });
  }

  async delete(id: number) {
    return prisma.cardProgression.delete({ where: { id } });
  }
}

export default new CardProgressionService();
