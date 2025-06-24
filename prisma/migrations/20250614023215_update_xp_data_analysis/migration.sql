/*
  Warnings:

  - You are about to drop the column `xp_datalytics` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `xp_datalytics` on the `UserStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cards" DROP COLUMN "xp_datalytics",
ADD COLUMN     "xp_data_analysis" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "UserStatistics" DROP COLUMN "xp_datalytics",
ADD COLUMN     "xp_data_analysis" INTEGER NOT NULL DEFAULT 0;
