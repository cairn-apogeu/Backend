/*
  Warnings:

  - You are about to drop the `Formulario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Acompanhantes" DROP CONSTRAINT "Acompanhantes_a_id_fkey";

-- DropForeignKey
ALTER TABLE "Acompanhantes" DROP CONSTRAINT "Acompanhantes_b_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "Formulario" DROP CONSTRAINT "Formulario_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEventoGrupo" DROP CONSTRAINT "UsuarioEventoGrupo_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "user_avaliation" DROP CONSTRAINT "user_avaliation_user_id_fkey";

-- DropTable
DROP TABLE "Formulario";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "ticket" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "objective" TEXT[],
    "occupation" TEXT[],
    "company_size" TEXT,
    "sector" TEXT[],
    "connected" INTEGER NOT NULL,
    "introversion" INTEGER NOT NULL,
    "dinner_zone_preference" TEXT NOT NULL,
    "subjects" TEXT[],
    "rational_or_emotional" TEXT NOT NULL,
    "hobbies" TEXT[],
    "religion" TEXT NOT NULL,
    "life_case" TEXT[],
    "nocturnal_habits" INTEGER NOT NULL,
    "invest" TEXT NOT NULL,
    "culinaries" TEXT[],
    "likes_to_test" INTEGER NOT NULL,
    "drinks" TEXT[],
    "food_restriction" TEXT[],
    "relationship_status" TEXT NOT NULL,
    "special_need" TEXT NOT NULL,
    "where_meet" TEXT NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_instagram_key" ON "user"("instagram");

-- CreateIndex
CREATE UNIQUE INDEX "form_user_id_key" ON "form"("user_id");

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acompanhantes" ADD CONSTRAINT "Acompanhantes_a_id_fkey" FOREIGN KEY ("a_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acompanhantes" ADD CONSTRAINT "Acompanhantes_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventoGrupo" ADD CONSTRAINT "UsuarioEventoGrupo_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_avaliation" ADD CONSTRAINT "user_avaliation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
