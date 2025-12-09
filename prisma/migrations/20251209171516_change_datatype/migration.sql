/*
  Warnings:

  - Changed the type of `default` on the `customers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "default",
ADD COLUMN     "default" "Status" NOT NULL;
