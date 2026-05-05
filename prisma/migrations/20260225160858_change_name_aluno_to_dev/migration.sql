-- CreateTable
CREATE TABLE "DailyDevPresence" (
    "daily_id" INTEGER NOT NULL,
    "dev_id" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DailyDevPresence_pkey" PRIMARY KEY ("daily_id","dev_id")
);

-- CreateIndex
CREATE INDEX "DailyDevPresence_dev_id_idx" ON "DailyDevPresence"("dev_id");

-- AddForeignKey
ALTER TABLE "DailyDevPresence" ADD CONSTRAINT "DailyDevPresence_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "Daily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDevPresence" ADD CONSTRAINT "DailyDevPresence_dev_id_fkey" FOREIGN KEY ("dev_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
