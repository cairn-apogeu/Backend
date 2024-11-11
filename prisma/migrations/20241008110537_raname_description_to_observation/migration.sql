/*
  Warnings:

  - You are about to drop the column `description` on the `event_rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_rating" DROP COLUMN "description",
ADD COLUMN     "observation" TEXT;
