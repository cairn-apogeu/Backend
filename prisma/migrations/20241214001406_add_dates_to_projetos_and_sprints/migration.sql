/*
  Warnings:

  - Added the required column `data_fim` to the `Projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_inicio` to the `Projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao_dias` to the `Projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_fim` to the `Sprints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_inicio` to the `Sprints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao_dias` to the `Sprints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projetos" ADD COLUMN     "data_fim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duracao_dias" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sprints" ADD COLUMN     "data_fim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duracao_dias" INTEGER NOT NULL;
