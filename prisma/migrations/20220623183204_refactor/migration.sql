/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `CragRating` will be added. If there are existing duplicate values, this will fail.
  - Made the column `authorId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cragId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Crag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cragId` on table `CragRating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `CragRating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `CragRole` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cragId` on table `CragRole` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `authorId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Made the column `cragId` on table `Visit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Visit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CragRating" DROP CONSTRAINT "CragRating_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CragRating" DROP CONSTRAINT "CragRating_cragId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "cragId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Crag" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CragRating" ALTER COLUMN "cragId" SET NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CragRole" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "cragId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "reactions" TEXT[],
ALTER COLUMN "cragId" SET NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CragRating_authorId_key" ON "CragRating"("authorId");

-- AddForeignKey
ALTER TABLE "CragRating" ADD CONSTRAINT "CragRating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CragRating" ADD CONSTRAINT "CragRating_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
