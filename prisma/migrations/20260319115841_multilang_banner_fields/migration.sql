/*
  Warnings:

  - You are about to drop the column `img` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `imgEn` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgMl` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkEn` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkMl` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleMl` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "img",
DROP COLUMN "link",
DROP COLUMN "title",
ADD COLUMN     "imgEn" TEXT NOT NULL,
ADD COLUMN     "imgMl" TEXT NOT NULL,
ADD COLUMN     "linkEn" TEXT NOT NULL,
ADD COLUMN     "linkMl" TEXT NOT NULL,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleMl" TEXT NOT NULL;
