import "dotenv/config";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../src/clients/prisma.client";

const SEED_LABEL = "Seed";
const NORMALIZED_SEED = SEED_LABEL.toLowerCase();

const clerkSecret = process.env.CLERK_SECRET_KEY;
if (!clerkSecret) {
  throw new Error("CLERK_SECRET_KEY não definido. Configure o .env antes de rodar o unseed.");
}

const clerk = createClerkClient({ secretKey: clerkSecret });
type ClerkUser = Awaited<ReturnType<typeof clerk.users.getUserList>>[number];

function isSeedClerkUser(user: ClerkUser): boolean {
  const usernameMatch = user.username?.toLowerCase().startsWith(`${NORMALIZED_SEED}_`);
  const emailMatch = (user.emailAddresses || []).some((address) =>
    address.emailAddress?.toLowerCase().startsWith(`${NORMALIZED_SEED}-`)
  );
  const hasSeedLabel =
    typeof user.publicMetadata?.tipo_perfil === "string" &&
    ["mentor", "cliente", "dev", "rh"].includes(
      (user.publicMetadata.tipo_perfil as string).toLowerCase()
    );

  return Boolean(usernameMatch || emailMatch || hasSeedLabel);
}

function extractUsers(payload: unknown): ClerkUser[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  const withData = payload as { data?: ClerkUser[] } | undefined;
  if (withData?.data && Array.isArray(withData.data)) {
    return withData.data;
  }
  return [];
}

async function findSeedClerkUserIds(): Promise<string[]> {
  const ids = new Set<string>();
  const limit = 100;
  let offset = 0;

  while (true) {
    const result = await clerk.users.getUserList({ limit, offset });
    const users = extractUsers(result);
    if (users.length === 0) break;
    for (const user of users) {
      if (isSeedClerkUser(user)) {
        ids.add(user.id);
      }
    }
    offset += users.length;
    if (users.length < limit) break;
  }

  return Array.from(ids);
}

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

    await prisma.devsProjetos.deleteMany({
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
  const ids = new Set(seedUserIds);
  const extraIds = await findSeedClerkUserIds();
  extraIds.forEach((id) => ids.add(id));

  for (const userId of ids) {
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
