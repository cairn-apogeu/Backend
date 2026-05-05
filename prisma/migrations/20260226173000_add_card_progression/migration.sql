-- Create CardProgression table to track card status transitions
CREATE TABLE "CardProgression" (
    "id" SERIAL PRIMARY KEY,
    "card_id" INTEGER NOT NULL,
    "projeto_id" INTEGER,
    "sprint_id" INTEGER,
    "from_status" "Status" NOT NULL,
    "to_status" "Status" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "CardProgression_card_id_idx" ON "CardProgression"("card_id");
CREATE INDEX "CardProgression_projeto_id_idx" ON "CardProgression"("projeto_id");
CREATE INDEX "CardProgression_sprint_id_idx" ON "CardProgression"("sprint_id");

ALTER TABLE "CardProgression"
  ADD CONSTRAINT "CardProgression_card_id_fkey"
  FOREIGN KEY ("card_id") REFERENCES "Cards"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CardProgression"
  ADD CONSTRAINT "CardProgression_projeto_id_fkey"
  FOREIGN KEY ("projeto_id") REFERENCES "Projetos"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CardProgression"
  ADD CONSTRAINT "CardProgression_sprint_id_fkey"
  FOREIGN KEY ("sprint_id") REFERENCES "Sprints"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
