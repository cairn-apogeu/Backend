// src/services/Cards.service.ts
import prisma from "../../clients/prisma.client";
import { CardsDto } from "./schemas/create-Cards.schema";

class CardsService {
  async findAll() {
    try {
      return await prisma.cards.findMany();
    } catch (error) {
      console.error("Erro ao recuperar os cards:", error);
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
      console.error(`Erro ao encontrar o card com ID ${id}:`, error);
      throw new Error("Falha ao encontrar o card");
    }
  }

  async create(createCardDto: CardsDto) {
    try {
      console.log("Criando card com dados:", createCardDto);
      const { assigned, ...rest } = createCardDto;
      const createdCard = await prisma.cards.create({
        data: {
          ...rest,
          assigned: assigned ? String(assigned) : undefined,
        },
      });
      console.log("Card criado com sucesso:", createdCard);
      return createdCard;
    } catch (error) {
      console.error("Erro ao criar o card:", error);
      throw new Error("Falha ao criar o card");
    }
  }

  async update(id: number, updateCardDto: Partial<CardsDto>) {
    try {
      console.log(`Atualizando card com ID ${id} com dados:`, updateCardDto);
      const { assigned, ...rest } = updateCardDto;
      const updatedCard = await prisma.cards.update({
        where: { id },
        data: {
          ...rest,
          assigned: assigned ? String(assigned) : undefined,
        },
      });
      console.log("Card atualizado com sucesso:", updatedCard);
      return updatedCard;
    } catch (error) {
      console.error(`Erro ao atualizar o card com ID ${id}:`, error);
      throw new Error("Falha ao atualizar o card");
    }
  }

  async delete(id: number) {
    try {
      await prisma.cards.delete({
        where: { id },
      });
      console.log(`Card com ID ${id} deletado com sucesso`);
    } catch (error) {
      console.error(`Erro ao deletar o card com ID ${id}:`, error);
      throw new Error("Falha ao deletar o card");
    }
  }

  async findByAssignedUser(userId: string) {
    try {
      const cards = await prisma.cards.findMany({
        where: { assigned: userId },
      });
      console.log(`Cards atribuídos ao usuário ${userId}:`, cards);
      return cards;
    } catch (error) {
      console.error(`Erro ao recuperar os cards atribuídos ao usuário ${userId}:`, error);
      throw new Error("Falha ao recuperar os cards atribuídos ao usuário");
    }
  }

  async findBySprint(sprintId: number) {
    try {
      const cards = await prisma.cards.findMany({
        where: { sprint: sprintId },
      });
      console.log(`Cards para o sprint ${sprintId}:`, cards);
      return cards;
    } catch (error) {
      console.error(`Erro ao recuperar os cards para o sprint ${sprintId}:`, error);
      throw new Error("Falha ao recuperar os cards para o sprint");
    }
  }
}

export default new CardsService();