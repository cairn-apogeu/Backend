import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não está definido para inicializar o Prisma.");
}

const adapter = new PrismaPg(databaseUrl);

const prisma = new PrismaClient({ adapter });

export default prisma;
