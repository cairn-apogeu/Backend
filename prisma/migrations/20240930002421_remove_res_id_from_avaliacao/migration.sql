/*
  Warnings:

  - You are about to drop the column `res_id` on the `Avaliacao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_res_id_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "res_id";
