/*
  Warnings:

  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('ACCEPTED', 'DENIED', 'PENDING');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isVerified",
ADD COLUMN     "status" "USER_STATUS" NOT NULL DEFAULT 'PENDING';
