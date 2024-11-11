/*
  Warnings:

  - You are about to drop the `Acompanhantes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventoGrupo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioEventoGrupo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_avaliation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SCHEDULE_STATUS" AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Acompanhantes" DROP CONSTRAINT "Acompanhantes_a_id_fkey";

-- DropForeignKey
ALTER TABLE "Acompanhantes" DROP CONSTRAINT "Acompanhantes_b_id_fkey";

-- DropForeignKey
ALTER TABLE "Acompanhantes" DROP CONSTRAINT "Acompanhantes_eve_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_eve_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "EventoGrupo" DROP CONSTRAINT "EventoGrupo_res_id_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEventoGrupo" DROP CONSTRAINT "UsuarioEventoGrupo_eve_id_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEventoGrupo" DROP CONSTRAINT "UsuarioEventoGrupo_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "user_avaliation" DROP CONSTRAINT "user_avaliation_avaliation_id_fkey";

-- DropForeignKey
ALTER TABLE "user_avaliation" DROP CONSTRAINT "user_avaliation_user_id_fkey";

-- AlterTable
ALTER TABLE "form" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- DropTable
DROP TABLE "Acompanhantes";

-- DropTable
DROP TABLE "Avaliacao";

-- DropTable
DROP TABLE "EventoGrupo";

-- DropTable
DROP TABLE "Restaurante";

-- DropTable
DROP TABLE "UsuarioEventoGrupo";

-- DropTable
DROP TABLE "user_avaliation";

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "datetime" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_schedule" (
    "user_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "status" "SCHEDULE_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_schedule_pkey" PRIMARY KEY ("user_id","schedule_id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "user_group_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rating" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "description" TEXT,
    "event_starts" INTEGER NOT NULL,
    "event_liked" TEXT[],
    "event_shouldGetBetter" TEXT[],
    "restaurant_stars" INTEGER NOT NULL,
    "restaurant_liked" TEXT[],
    "restaurant_shouldGetBetter" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rating" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating_id" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "liked" TEXT[],
    "shouldGetBetter" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedule_datetime_key" ON "schedule"("datetime");

-- AddForeignKey
ALTER TABLE "user_schedule" ADD CONSTRAINT "user_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_schedule" ADD CONSTRAINT "user_schedule_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rating" ADD CONSTRAINT "event_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rating" ADD CONSTRAINT "user_rating_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "event_rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rating" ADD CONSTRAINT "user_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
