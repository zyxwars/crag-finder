/*
  Warnings:

  - The `role` column on the `CragRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('observer', 'moderator', 'owner');

-- AlterTable
ALTER TABLE "CragRole" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'observer';
