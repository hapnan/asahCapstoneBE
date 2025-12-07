-- CreateEnum
CREATE TYPE "mariageStatus" AS ENUM ('divorced', 'married', 'single', 'unknown');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('yes', 'no', 'unknown');

-- CreateEnum
CREATE TYPE "days" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateEnum
CREATE TYPE "months" AS ENUM ('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');

-- CreateEnum
CREATE TYPE "subscribeStatus" AS ENUM ('failure', 'nonexistent', 'success');

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "job" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "marital" "mariageStatus" NOT NULL,
    "contact_comunication" TEXT NOT NULL,
    "housing_loan" "Status" NOT NULL,
    "personal_loan" "Status" NOT NULL,
    "has_credit" "Status" NOT NULL,
    "last_day_contacted" "days" NOT NULL,
    "last_month_contacted" "months" NOT NULL,
    "how_many_contacted_now" INTEGER NOT NULL,
    "how_many_contacted_previous" INTEGER NOT NULL,
    "days_last_contacted" INTEGER NOT NULL,
    "result_of_last_campaign" "subscribeStatus" NOT NULL,
    "predictive_subscribe" "subscribeStatus" NOT NULL,
    "predictive_score_subscribe" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);
