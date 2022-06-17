-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "cragId" INTEGER;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_cragId_fkey" FOREIGN KEY ("cragId") REFERENCES "Crag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
