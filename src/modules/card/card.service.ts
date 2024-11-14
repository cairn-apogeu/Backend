import prisma from "../../clients/prisma.client";

class CardService {
    async findBySprint(sprintId: number) {
        try {
            return await prisma.cards.findMany({
                where: {
                    sprint: sprintId
                }
            });
        } catch (error) {
            throw new Error("Failed to fetch cards for the specified sprint");
        }
    }
}

export default new CardService();