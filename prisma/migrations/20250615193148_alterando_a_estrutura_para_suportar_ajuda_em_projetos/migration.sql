/*
  Warnings:

  - You are about to drop the column `id_gestor` on the `Projetos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Projetos" DROP CONSTRAINT "Projetos_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "Projetos" DROP CONSTRAINT "Projetos_id_gestor_fkey";

-- DropIndex
DROP INDEX "fk_projetos_id_gestor";

-- AlterTable
ALTER TABLE "Projetos" DROP COLUMN "id_gestor",
ADD COLUMN     "id_helper" TEXT,
ADD COLUMN     "id_mentor" TEXT,
ALTER COLUMN "id_cliente" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "fk_projetos_id_mentor" ON "Projetos"("id_mentor");

-- CreateIndex
CREATE INDEX "fk_projetos_id_helper" ON "Projetos"("id_helper");

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_mentor_fkey" FOREIGN KEY ("id_mentor") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_helper_fkey" FOREIGN KEY ("id_helper") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;
