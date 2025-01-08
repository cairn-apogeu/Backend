/*
  Warnings:

  - You are about to drop the column `data_fim` on the `Projetos` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `Projetos` table. All the data in the column will be lost.
  - You are about to drop the column `duracao_dias` on the `Projetos` table. All the data in the column will be lost.
  - You are about to drop the column `data_fim` on the `Sprints` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `Sprints` table. All the data in the column will be lost.
  - You are about to drop the column `duracao_dias` on the `Sprints` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projetos" DROP COLUMN "data_fim",
DROP COLUMN "data_inicio",
DROP COLUMN "duracao_dias",
ADD COLUMN     "dia_fim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dia_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sprints" DROP COLUMN "data_fim",
DROP COLUMN "data_inicio",
DROP COLUMN "duracao_dias",
ADD COLUMN     "dia_fim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dia_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
