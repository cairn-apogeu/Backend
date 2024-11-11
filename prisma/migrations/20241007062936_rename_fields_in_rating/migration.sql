/*
  Warnings:

  - You are about to drop the column `event_shouldGetBetter` on the `event_rating` table. All the data in the column will be lost.
  - You are about to drop the column `restaurant_shouldGetBetter` on the `event_rating` table. All the data in the column will be lost.
  - You are about to drop the column `shouldGetBetter` on the `user_rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_rating" DROP COLUMN "event_shouldGetBetter",
DROP COLUMN "restaurant_shouldGetBetter",
ADD COLUMN     "event_should_get_better" TEXT[],
ADD COLUMN     "restaurant_should_get_better" TEXT[];

-- AlterTable
ALTER TABLE "user_rating" DROP COLUMN "shouldGetBetter",
ADD COLUMN     "should_get_better" TEXT[];
