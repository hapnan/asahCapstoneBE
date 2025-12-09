-- CreateTable
CREATE TABLE "analitics" (
    "id" SERIAL NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_customer" INTEGER NOT NULL,
    "status" "subscribeStatus" NOT NULL,

    CONSTRAINT "analitics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "analitics" ADD CONSTRAINT "analitics_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analitics" ADD CONSTRAINT "analitics_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
