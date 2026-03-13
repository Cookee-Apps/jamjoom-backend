-- CreateTable
CREATE TABLE "TrollyReward" (
    "id" TEXT NOT NULL,
    "giftName" TEXT NOT NULL,
    "giftImage" TEXT NOT NULL,
    "termsAndConditions" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrollyReward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrollyReward" ADD CONSTRAINT "TrollyReward_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
