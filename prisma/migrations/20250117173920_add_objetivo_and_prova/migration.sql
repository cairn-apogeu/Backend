-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('MUITO_FACIL', 'FACIL', 'MEDIO', 'DIFICIL', 'MUITO_DIFICIL');

-- AlterTable: Cards
ALTER TABLE "Cards"
    ADD COLUMN "computed" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "difficulty" "Difficulty",
    ALTER COLUMN "xp_frontend" DROP DEFAULT,
    ALTER COLUMN "xp_backend" DROP DEFAULT,
    ALTER COLUMN "xp_negocios" DROP DEFAULT,
    ALTER COLUMN "xp_arquitetura" DROP DEFAULT,
    ALTER COLUMN "xp_design" DROP DEFAULT,
    ALTER COLUMN "xp_datalytics" DROP DEFAULT;

ALTER TABLE "Cards"
    ALTER COLUMN "xp_frontend" TYPE BOOLEAN USING (xp_frontend::BOOLEAN),
    ALTER COLUMN "xp_backend" TYPE BOOLEAN USING (xp_backend::BOOLEAN),
    ALTER COLUMN "xp_negocios" TYPE BOOLEAN USING (xp_negocios::BOOLEAN),
    ALTER COLUMN "xp_arquitetura" TYPE BOOLEAN USING (xp_arquitetura::BOOLEAN),
    ALTER COLUMN "xp_design" TYPE BOOLEAN USING (xp_design::BOOLEAN),
    ALTER COLUMN "xp_datalytics" TYPE BOOLEAN USING (xp_datalytics::BOOLEAN);

-- AlterTable: Users
ALTER TABLE "Users"
    ADD COLUMN "xp_frontend" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "xp_backend" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "xp_negocios" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "xp_arquitetura" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "xp_design" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "xp_datalytics" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "prova_pr" TEXT;

-- AlterTable
ALTER TABLE "Sprints" ADD COLUMN     "objetivo" TEXT;
