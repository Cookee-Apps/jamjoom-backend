/*
  Warnings:

  - You are about to drop the column `image` on the `TrollyGift` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TrollyGift` table. All the data in the column will be lost.
  - You are about to drop the column `tAndc` on the `TrollyGift` table. All the data in the column will be lost.
  - Added the required column `imgEn` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgMl` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameMl` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tAndcEn` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tAndcMl` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TrollyGift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrollyGift" DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "tAndc",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imgEn" TEXT NOT NULL,
ADD COLUMN     "imgMl" TEXT NOT NULL,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameMl" TEXT NOT NULL,
ADD COLUMN     "tAndcEn" TEXT NOT NULL,
ADD COLUMN     "tAndcMl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
