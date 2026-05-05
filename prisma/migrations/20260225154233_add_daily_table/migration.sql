-- CreateTable
CREATE TABLE "Daily" (
    "id" SERIAL NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Daily_projeto_id_idx" ON "Daily"("projeto_id");

-- CreateIndex
CREATE INDEX "Daily_sprint_id_idx" ON "Daily"("sprint_id");

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
