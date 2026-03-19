/*
Warnings:

- You are about to drop the column `name` on the `ComplaintCategory` table. All the data in the column will be lost.
- You are about to drop the `TrollyReward` table. If the table is not empty, all the data it contains will be lost.
- Added the required column `nameEn` to the `ComplaintCategory` table without a default value. This is not possible if the table is not empty.
- Added the required column `nameMl` to the `ComplaintCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TrollyReward"
DROP CONSTRAINT "TrollyReward_storeId_fkey";

-- AlterTable
ALTER TABLE "ComplaintCategory" RENAME COLUMN "name" TO "nameEn";

ALTER TABLE "ComplaintCategory"
ADD COLUMN "nameMl" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "public"."TrollyReward";