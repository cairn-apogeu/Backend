/*
  Warnings:

  - You are about to drop the column `ticket` on the `user` table. All the data in the column will be lost.
  - Changed the type of `gender` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "ticket",
DROP COLUMN "gender",
ADD COLUMN     "gender" "GENDER" NOT NULL;
