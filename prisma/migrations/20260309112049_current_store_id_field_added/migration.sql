-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "currentStoreId" TEXT;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_currentStoreId_fkey" FOREIGN KEY ("currentStoreId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
