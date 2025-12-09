/*
  Warnings:

  - Changed the type of `predictive_subscribe` on the `predict` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "predict" DROP COLUMN "predictive_subscribe",
ADD COLUMN     "predictive_subscribe" TEXT NOT NULL;
