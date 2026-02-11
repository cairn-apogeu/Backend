import "dotenv/config";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../src/clients/prisma.client";

const SEED_LABEL = "Seed";

const clerkSecret = process.env.CLERK_SECRET_KEY;
if (!clerkSecret) {
  throw new Error("CLERK_SECRET_KEY não definido. Configure o .env antes de rodar o unseed.");
}

const clerk = createClerkClient({ secretKey: clerkSecret });

async function cleanupDatabase() {
  const seedUsers = await prisma.users.findMany({
    where: {
      OR: [
        { discord: { startsWith: "seed" } },
        { biografia: { contains: SEED_LABEL } },
      ],
    },
    select: { user_clerk_id: true },
  });
  const seedUserIds = seedUsers.map((user) => user.user_clerk_id);

  const seedProjects = await prisma.projetos.findMany({
    where: { nome: { startsWith: `${SEED_LABEL} ` } },
    select: { id: true },
  });
  const projectIds = seedProjects.map((p) => p.id);

  if (projectIds.length > 0) {
    const sprintIds = (
      await prisma.sprints.findMany({
        where: { id_projeto: { in: projectIds } },
        select: { id: true },
      })
    ).map((s) => s.id);

    await prisma.cards.deleteMany({
      where: {
        OR: [
          { projeto: { in: projectIds } },
          { sprint: { in: sprintIds } },
        ],
      },
    });

    await prisma.sprints.deleteMany({
      where: { id_projeto: { in: projectIds } },
    });

    await prisma.alunosProjetos.deleteMany({
      where: { projeto_id: { in: projectIds } },
    });

    await prisma.projetos.deleteMany({
      where: { id: { in: projectIds } },
    });
  }

  if (seedUserIds.length > 0) {
    await prisma.userStatistics.deleteMany({
      where: { user_clerk_id: { in: seedUserIds } },
    });

    await prisma.users.deleteMany({
      where: { user_clerk_id: { in: seedUserIds } },
    });
  }
  return seedUserIds;
}

async function cleanupClerkUsers(seedUserIds: string[]) {
  for (const userId of seedUserIds) {
    if (!userId) continue;
    try {
      await clerk.users.deleteUser(userId);
      console.log(`Removido usuário Clerk ${userId}`);
    } catch (error) {
      console.warn(`Falha ao remover usuário Clerk ${userId}`, error);
    }
  }
}

async function main() {
  const seedUserIds = await cleanupDatabase();
  await cleanupClerkUsers(seedUserIds);
}

main()
  .then(async () => {
    console.log("Unseed concluído.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Erro ao executar unseed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
