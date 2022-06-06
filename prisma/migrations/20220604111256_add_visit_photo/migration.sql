-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_cragId_fkey";

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "newFilename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "visitId" INTEGER,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
