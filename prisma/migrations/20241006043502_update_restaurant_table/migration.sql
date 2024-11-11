/*
  Warnings:

  - The primary key for the `Restaurante` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Endereco` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `Latitude` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `Nome` on the `Restaurante` table. All the data in the column will be lost.
  - You are about to drop the column `res_id` on the `Restaurante` table. All the data in the column will be lost.
  - Added the required column `address` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Restaurante` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `latitude` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Restaurante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Restaurante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventoGrupo" DROP CONSTRAINT "EventoGrupo_res_id_fkey";

-- AlterTable
ALTER TABLE "EventoGrupo" ALTER COLUMN "Quarta" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Restaurante" DROP CONSTRAINT "Restaurante_pkey",
DROP COLUMN "Endereco",
DROP COLUMN "Latitude",
DROP COLUMN "Longitude",
DROP COLUMN "Nome",
DROP COLUMN "res_id",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "EventoGrupo" ADD CONSTRAINT "EventoGrupo_res_id_fkey" FOREIGN KEY ("res_id") REFERENCES "Restaurante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
