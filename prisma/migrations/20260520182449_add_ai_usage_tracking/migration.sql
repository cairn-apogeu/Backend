-- CreateTable
CREATE TABLE "AiUsageTracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acu_consumption_after_response" DOUBLE PRECISION,
    "doing_cards_snapshot" JSONB NOT NULL,

    CONSTRAINT "AiUsageTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiUsageTracking_user_id_idx" ON "AiUsageTracking"("user_id");

-- CreateIndex
CREATE INDEX "AiUsageTracking_created_at_idx" ON "AiUsageTracking"("created_at");

-- AddForeignKey
ALTER TABLE "AiUsageTracking" ADD CONSTRAINT "AiUsageTracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
