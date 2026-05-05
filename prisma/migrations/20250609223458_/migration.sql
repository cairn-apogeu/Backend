/*
  Warnings:

  - You are about to drop the column `xp_arquitetura` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_backend` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_datalytics` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_design` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_frontend` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_negocios` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "xp_arquitetura",
DROP COLUMN "xp_backend",
DROP COLUMN "xp_datalytics",
DROP COLUMN "xp_design",
DROP COLUMN "xp_frontend",
DROP COLUMN "xp_negocios";

-- CreateTable
CREATE TABLE "UserStatistics" (
    "id" SERIAL NOT NULL,
    "user_clerk_id" TEXT NOT NULL,
    "xp_frontend" INTEGER NOT NULL DEFAULT 0,
    "xp_backend" INTEGER NOT NULL DEFAULT 0,
    "xp_negocios" INTEGER NOT NULL DEFAULT 0,
    "xp_arquitetura" INTEGER NOT NULL DEFAULT 0,
    "xp_design" INTEGER NOT NULL DEFAULT 0,
    "xp_datalytics" INTEGER NOT NULL DEFAULT 0,
    "total_throughput" INTEGER NOT NULL DEFAULT 0,
    "deltatime_predict" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "average_daily" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStatistics_user_clerk_id_key" ON "UserStatistics"("user_clerk_id");

-- CreateIndex
CREATE INDEX "UserStatistics_user_clerk_id_idx" ON "UserStatistics"("user_clerk_id");

-- AddForeignKey
ALTER TABLE "UserStatistics" ADD CONSTRAINT "UserStatistics_user_clerk_id_fkey" FOREIGN KEY ("user_clerk_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
