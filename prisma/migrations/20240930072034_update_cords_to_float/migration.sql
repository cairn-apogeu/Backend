/*
  Warnings:

  - Made the column `Latitude` on table `Restaurante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Longitude` on table `Restaurante` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurante" ALTER COLUMN "Latitude" SET NOT NULL,
ALTER COLUMN "Latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "Longitude" SET NOT NULL,
ALTER COLUMN "Longitude" SET DATA TYPE DOUBLE PRECISION;
