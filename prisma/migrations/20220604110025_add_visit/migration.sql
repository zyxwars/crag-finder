-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cragId" INTEGER,
    "authorId" INTEGER,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
