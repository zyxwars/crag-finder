/*
  Warnings:

  - You are about to drop the `CragPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CragPermissions" DROP CONSTRAINT "CragPermissions_cragId_fkey";

-- DropForeignKey
ALTER TABLE "CragPermissions" DROP CONSTRAINT "CragPermissions_userId_fkey";

-- DropTable
DROP TABLE "CragPermissions";

-- CreateTable
CREATE TABLE "CragRole" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL DEFAULT E'observer',
    "userId" INTEGER,
    "cragId" INTEGER,

    CONSTRAINT "CragRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CragRole" ADD CONSTRAINT "CragRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CragRole" ADD CONSTRAINT "CragRole_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
