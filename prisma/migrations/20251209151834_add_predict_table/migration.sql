/*
  Warnings:

  - You are about to drop the column `contact_comunication` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `housing_loan` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `personal_loan` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `predictive_score_subscribe` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `predictive_subscribe` on the `customers` table. All the data in the column will be lost.
  - Added the required column `campaign` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cons_conf_idx` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cons_price_idx` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_var_rate` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `euribor3m` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `housing` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loan` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nr_employed` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdays` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poutcome` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "contact_comunication",
DROP COLUMN "housing_loan",
DROP COLUMN "personal_loan",
DROP COLUMN "predictive_score_subscribe",
DROP COLUMN "predictive_subscribe",
ADD COLUMN     "campaign" INTEGER NOT NULL,
ADD COLUMN     "cons_conf_idx" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cons_price_idx" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "day_of_week" TEXT NOT NULL,
ADD COLUMN     "default" BOOLEAN NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "emp_var_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "euribor3m" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "housing" "Status" NOT NULL,
ADD COLUMN     "loan" "Status" NOT NULL,
ADD COLUMN     "month" TEXT NOT NULL,
ADD COLUMN     "nr_employed" INTEGER NOT NULL,
ADD COLUMN     "pdays" INTEGER NOT NULL,
ADD COLUMN     "poutcome" TEXT NOT NULL,
ADD COLUMN     "previous" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "predict" (
    "id" SERIAL NOT NULL,
    "id_customer" INTEGER NOT NULL,
    "predictive_subscribe" "subscribeStatus" NOT NULL,
    "predictive_score_subscribe" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "predict_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "predict" ADD CONSTRAINT "predict_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
