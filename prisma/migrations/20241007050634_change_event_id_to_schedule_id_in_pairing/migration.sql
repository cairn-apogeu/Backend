/*
  Warnings:

  - The primary key for the `pairing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `pairing` table. All the data in the column will be lost.
  - Added the required column `schedule_id` to the `pairing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pairing" DROP CONSTRAINT "pairing_event_id_fkey";

-- AlterTable
ALTER TABLE "pairing" DROP CONSTRAINT "pairing_pkey",
DROP COLUMN "event_id",
ADD COLUMN     "schedule_id" TEXT NOT NULL,
ADD CONSTRAINT "pairing_pkey" PRIMARY KEY ("primary_user_id", "paired_user_id", "schedule_id");

-- AddForeignKey
ALTER TABLE "pairing" ADD CONSTRAINT "pairing_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
