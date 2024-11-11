/*
  Warnings:

  - You are about to drop the column `avaliacaoEvento` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacaoRestaurante` on the `Avaliacao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "avaliacaoEvento",
DROP COLUMN "avaliacaoRestaurante",
ADD COLUMN     "event_liked" TEXT[],
ADD COLUMN     "event_shouldGetBetter" TEXT[],
ADD COLUMN     "event_starts" INTEGER,
ADD COLUMN     "restaurant_liked" TEXT[],
ADD COLUMN     "restaurant_shouldGetBetter" TEXT[],
ADD COLUMN     "restaurant_stars" INTEGER;
