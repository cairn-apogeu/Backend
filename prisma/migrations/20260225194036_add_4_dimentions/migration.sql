/*
  Warnings:

  - Changed the type of `tipo_perfil` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPerfil" AS ENUM ('Mentor', 'Cliente', 'Dev', 'Admin', 'RH');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "tipo_perfil",
ADD COLUMN     "tipo_perfil" "TipoPerfil" NOT NULL;

-- CreateTable
CREATE TABLE "CapacidadeCognitivaAplicada" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "daily_id" INTEGER,
    "reformulacao_problema" INTEGER,
    "separacao_sintoma_causa" INTEGER,
    "autocritica_tecnica" INTEGER,
    "escolha_abordagens_tecnicas" INTEGER,

    CONSTRAINT "CapacidadeCognitivaAplicada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComunicacaoOperacional" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "daily_id" INTEGER,
    "validacao_entendimento_pre_execucao" INTEGER,
    "clareza_exposicao_tecnica" INTEGER,
    "participacao_discussoes_tecnicas" INTEGER,
    "sinalizacao_desalinhamento_ruido" INTEGER,

    CONSTRAINT "ComunicacaoOperacional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecucaoConfiavel" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "daily_id" INTEGER,
    "delta_time_predict" INTEGER,
    "reestimativa_ativa" INTEGER,
    "estabilidade_throughput" INTEGER,
    "sinalizacao_bloqueios" INTEGER,
    "qualidade_cards_dor" INTEGER,
    "aderencia_entregas_dod" INTEGER,

    CONSTRAINT "ExecucaoConfiavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContribuicaoSistemica" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "daily_id" INTEGER,
    "ajudas_prestadas" INTEGER,
    "sinalizacao_risco_tecnico_integracao" INTEGER,
    "compartilhamento_solucoes" INTEGER,
    "participacao_feedbacks" INTEGER,

    CONSTRAINT "ContribuicaoSistemica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CapacidadeCognitivaAplicada_user_id_idx" ON "CapacidadeCognitivaAplicada"("user_id");

-- CreateIndex
CREATE INDEX "CapacidadeCognitivaAplicada_sprint_id_idx" ON "CapacidadeCognitivaAplicada"("sprint_id");

-- CreateIndex
CREATE INDEX "CapacidadeCognitivaAplicada_daily_id_idx" ON "CapacidadeCognitivaAplicada"("daily_id");

-- CreateIndex
CREATE INDEX "ComunicacaoOperacional_user_id_idx" ON "ComunicacaoOperacional"("user_id");

-- CreateIndex
CREATE INDEX "ComunicacaoOperacional_sprint_id_idx" ON "ComunicacaoOperacional"("sprint_id");

-- CreateIndex
CREATE INDEX "ComunicacaoOperacional_daily_id_idx" ON "ComunicacaoOperacional"("daily_id");

-- CreateIndex
CREATE INDEX "ExecucaoConfiavel_user_id_idx" ON "ExecucaoConfiavel"("user_id");

-- CreateIndex
CREATE INDEX "ExecucaoConfiavel_sprint_id_idx" ON "ExecucaoConfiavel"("sprint_id");

-- CreateIndex
CREATE INDEX "ExecucaoConfiavel_daily_id_idx" ON "ExecucaoConfiavel"("daily_id");

-- CreateIndex
CREATE INDEX "ContribuicaoSistemica_user_id_idx" ON "ContribuicaoSistemica"("user_id");

-- CreateIndex
CREATE INDEX "ContribuicaoSistemica_sprint_id_idx" ON "ContribuicaoSistemica"("sprint_id");

-- CreateIndex
CREATE INDEX "ContribuicaoSistemica_daily_id_idx" ON "ContribuicaoSistemica"("daily_id");

-- AddForeignKey
ALTER TABLE "CapacidadeCognitivaAplicada" ADD CONSTRAINT "CapacidadeCognitivaAplicada_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacidadeCognitivaAplicada" ADD CONSTRAINT "CapacidadeCognitivaAplicada_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacidadeCognitivaAplicada" ADD CONSTRAINT "CapacidadeCognitivaAplicada_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComunicacaoOperacional" ADD CONSTRAINT "ComunicacaoOperacional_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComunicacaoOperacional" ADD CONSTRAINT "ComunicacaoOperacional_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComunicacaoOperacional" ADD CONSTRAINT "ComunicacaoOperacional_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecucaoConfiavel" ADD CONSTRAINT "ExecucaoConfiavel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecucaoConfiavel" ADD CONSTRAINT "ExecucaoConfiavel_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecucaoConfiavel" ADD CONSTRAINT "ExecucaoConfiavel_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContribuicaoSistemica" ADD CONSTRAINT "ContribuicaoSistemica_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContribuicaoSistemica" ADD CONSTRAINT "ContribuicaoSistemica_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContribuicaoSistemica" ADD CONSTRAINT "ContribuicaoSistemica_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
