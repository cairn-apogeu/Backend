-- CreateTable
CREATE TABLE "pairing" (
    "primary_user_id" TEXT NOT NULL,
    "paired_user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pairing_pkey" PRIMARY KEY ("primary_user_id","paired_user_id","event_id")
);

-- AddForeignKey
ALTER TABLE "pairing" ADD CONSTRAINT "pairing_primary_user_id_fkey" FOREIGN KEY ("primary_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairing" ADD CONSTRAINT "pairing_paired_user_id_fkey" FOREIGN KEY ("paired_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairing" ADD CONSTRAINT "pairing_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
