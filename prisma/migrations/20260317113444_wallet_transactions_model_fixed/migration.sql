/*
  Warnings:

  - Added the required column `intermediateBalance` to the `WalletTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WalletTransactions" ADD COLUMN     "intermediateBalance" INTEGER NOT NULL,
ADD COLUMN     "refNo" SERIAL NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "storeId" TEXT;

-- AddForeignKey
ALTER TABLE "WalletTransactions" ADD CONSTRAINT "WalletTransactions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
