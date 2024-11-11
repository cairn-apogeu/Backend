/*
  Warnings:

  - Added the required column `city` to the `user` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `number` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "city" TEXT NOT NULL,
DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL;
