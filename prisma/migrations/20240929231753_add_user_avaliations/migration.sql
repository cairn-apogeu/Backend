/*
  Warnings:

  - You are about to drop the column `avaliacaoUsuario` on the `Avaliacao` table. All the data in the column will be lost.
  - Added the required column `res_id` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "avaliacaoUsuario",
ADD COLUMN     "res_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_avaliation" (
    "id" SERIAL NOT NULL,
    "avaliation_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "liked" TEXT[],
    "shouldGetBetter" TEXT[],

    CONSTRAINT "user_avaliation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_res_id_fkey" FOREIGN KEY ("res_id") REFERENCES "Restaurante"("res_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_avaliation" ADD CONSTRAINT "user_avaliation_avaliation_id_fkey" FOREIGN KEY ("avaliation_id") REFERENCES "Avaliacao"("ava_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_avaliation" ADD CONSTRAINT "user_avaliation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;
