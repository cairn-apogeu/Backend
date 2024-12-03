-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "projeto" INTEGER;

-- CreateIndex
CREATE INDEX "fk_cards_projeto" ON "Cards"("projeto");

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_projeto_fkey" FOREIGN KEY ("projeto") REFERENCES "Projetos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
