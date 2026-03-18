-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "refNo" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "TrollyConfig" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "perDayGiftLimit" INTEGER NOT NULL,
    "remainingStock" INTEGER NOT NULL,

    CONSTRAINT "TrollyConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrollyGift" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tAndc" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TrollyGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrollyScans" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "giftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrollyScans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrollyConfig_giftId_key" ON "TrollyConfig"("giftId");

-- CreateIndex
CREATE INDEX "TrollyConfig_giftId_idx" ON "TrollyConfig"("giftId");

-- CreateIndex
CREATE INDEX "TrollyGift_storeId_idx" ON "TrollyGift"("storeId");

-- AddForeignKey
ALTER TABLE "TrollyConfig" ADD CONSTRAINT "TrollyConfig_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "TrollyGift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrollyGift" ADD CONSTRAINT "TrollyGift_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrollyScans" ADD CONSTRAINT "TrollyScans_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrollyScans" ADD CONSTRAINT "TrollyScans_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrollyScans" ADD CONSTRAINT "TrollyScans_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "TrollyGift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
