-- DropForeignKey
ALTER TABLE "CardProgression" DROP CONSTRAINT "CardProgression_card_id_fkey";

-- AddForeignKey
ALTER TABLE "CardProgression" ADD CONSTRAINT "CardProgression_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
