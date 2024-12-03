import prisma from "../../clients/prisma.client";
import { CardsDto } from "./schemas/create-Cards.schema";

class CardsService {
  async findAll() {
    try {
      return await prisma.cards.findMany();
    } catch (error) {
      throw new Error("Falha ao recuperar os cards");
    }
  }

  async findById(id: number) {
    try {
      const card = await prisma.cards.findUnique({
        where: { id },
      });

      if (!card) throw new Error("Card não encontrado");

      return card;
    } catch (error) {
      throw new Error("Falha ao encontrar o card");
    }
  }

  async create(createCardDto: CardsDto) {
    try {
      console.log("Dados enviados ao Prisma:", createCardDto);
      return await prisma.cards.create({
        data: createCardDto,
      });
    } catch (error) {
      console.error("Erro no Prisma:", (error as any).message, error);
      throw new Error("Falha ao criar o card");
    }
  }
  

  async update(id: number, updateCardDto: Partial<CardsDto>) {
    try {
      return await prisma.cards.update({
        where: { id },
        data: updateCardDto,
      });
    } catch (error) {
      throw new Error("Falha ao atualizar o card");
    }
  }

  async delete(id: number) {
    try {
      return await prisma.cards.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar o card");
    }
  }

  async findByAssignedUser(userId: string) {
    try {
      return await prisma.cards.findMany({
        where: { assigned: userId },
      });
    } catch (error) {
      throw new Error("Falha ao recuperar os cards atribuídos ao usuário");
    }
  }

  async findBySprint(sprintId: number) {
    try {
      return await prisma.cards.findMany({
        where: { sprint: sprintId },
      });
    } catch (error) {
      throw new Error("Falha ao recuperar os cards para o sprint");
    }
  }
}

export default new CardsService();
