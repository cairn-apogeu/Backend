/*
  Warnings:

  - You are about to drop the column `data_criacao` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `dod` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `dor` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `indicacao_conteudo` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_arquitetura` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_backend` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_datalytics` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_design` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_frontend` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_negocios` on the `Cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cards" DROP COLUMN "data_criacao",
DROP COLUMN "dod",
DROP COLUMN "dor",
DROP COLUMN "indicacao_conteudo",
DROP COLUMN "xp_arquitetura",
DROP COLUMN "xp_backend",
DROP COLUMN "xp_datalytics",
DROP COLUMN "xp_design",
DROP COLUMN "xp_frontend",
DROP COLUMN "xp_negocios";
