-- CreateTable
CREATE TABLE "CragRating" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "cragId" INTEGER,
    "authorId" INTEGER,

    CONSTRAINT "CragRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CragRating" ADD CONSTRAINT "CragRating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CragRating" ADD CONSTRAINT "CragRating_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
