-- AlterTable
ALTER TABLE "AiUsageTracking" ADD COLUMN     "devin_response" TEXT,
ADD COLUMN     "devin_session_id" TEXT;

-- CreateIndex
CREATE INDEX "AiUsageTracking_devin_session_id_idx" ON "AiUsageTracking"("devin_session_id");
