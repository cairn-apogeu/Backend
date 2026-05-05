/*
  Warnings:

  - You are about to drop the `Daily` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Daily" DROP CONSTRAINT "Daily_projeto_id_fkey";

-- DropForeignKey
ALTER TABLE "Daily" DROP CONSTRAINT "Daily_sprint_id_fkey";

-- DropTable
DROP TABLE "Daily";
