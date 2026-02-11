/*
  Warnings:

  - The `status` column on the `Cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Backlog', 'ToDo', 'Doing', 'Done', 'Prevented', 'CanMine');

-- AlterTable
ALTER TABLE "Cards" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Backlog';
