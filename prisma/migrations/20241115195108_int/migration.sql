/*
  Warnings:

  - The primary key for the `AlunosProjetos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sexo` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlunosProjetos" DROP CONSTRAINT "AlunosProjetos_aluno_id_fkey";

-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_assigned_fkey";

-- DropForeignKey
ALTER TABLE "Projetos" DROP CONSTRAINT "Projetos_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "Projetos" DROP CONSTRAINT "Projetos_id_gestor_fkey";

-- AlterTable
ALTER TABLE "AlunosProjetos" DROP CONSTRAINT "AlunosProjetos_pkey",
ALTER COLUMN "aluno_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AlunosProjetos_pkey" PRIMARY KEY ("projeto_id", "aluno_id");

-- AlterTable
ALTER TABLE "Cards" ALTER COLUMN "assigned" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Projetos" ALTER COLUMN "id_cliente" SET DATA TYPE TEXT,
ALTER COLUMN "id_gestor" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "sexo",
ADD COLUMN     "genero" VARCHAR(10),
ALTER COLUMN "user_clerk_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("user_clerk_id");

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_gestor_fkey" FOREIGN KEY ("id_gestor") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunosProjetos" ADD CONSTRAINT "AlunosProjetos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_assigned_fkey" FOREIGN KEY ("assigned") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;
