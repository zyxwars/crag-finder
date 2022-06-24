/*
  Warnings:

  - A unique constraint covering the columns `[cragId,authorId]` on the table `CragRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CragRating_cragId_authorId_key" ON "CragRating"("cragId", "authorId");
