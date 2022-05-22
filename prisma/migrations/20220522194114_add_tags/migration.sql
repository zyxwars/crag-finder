/*
  Warnings:

  - Added the required column `tags` to the `Crag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crag" ADD COLUMN     "tags" TEXT NOT NULL;
