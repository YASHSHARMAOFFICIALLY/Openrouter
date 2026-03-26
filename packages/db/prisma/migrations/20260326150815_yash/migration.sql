/*
  Warnings:

  - You are about to drop the column `disbaled` on the `ApiKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "disbaled",
ADD COLUMN     "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUsed" TIMESTAMP(3);
