-- AddForeignKey
ALTER TABLE "event_rating" ADD CONSTRAINT "event_rating_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
