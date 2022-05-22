/*
  Warnings:

  - You are about to drop the column `visitId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `sessionVersion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Visit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_visitId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_cragId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "visitId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sessionVersion";

-- DropTable
DROP TABLE "Visit";

-- CreateTable
CREATE TABLE "CragPermissions" (
    "id" SERIAL NOT NULL,
    "name" BOOLEAN NOT NULL DEFAULT false,
    "content" BOOLEAN NOT NULL DEFAULT false,
    "tags" BOOLEAN NOT NULL DEFAULT false,
    "postPhotos" BOOLEAN NOT NULL DEFAULT false,
    "deletePhotos" BOOLEAN NOT NULL DEFAULT false,
    "deleteComments" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "cragId" INTEGER,

    CONSTRAINT "CragPermissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CragPermissions" ADD CONSTRAINT "CragPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CragPermissions" ADD CONSTRAINT "CragPermissions_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
