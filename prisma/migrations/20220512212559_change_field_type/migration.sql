/*
  Warnings:

  - Changed the type of `size` on the `Photo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER NOT NULL;
