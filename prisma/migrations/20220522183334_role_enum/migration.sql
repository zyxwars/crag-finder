/*
  Warnings:

  - The values [observer,moderator,owner] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('OBSERVER', 'MODERATOR', 'OWNER');
ALTER TABLE "CragRole" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "CragRole" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "CragRole" ALTER COLUMN "role" SET DEFAULT 'OBSERVER';
COMMIT;

-- AlterTable
ALTER TABLE "CragRole" ALTER COLUMN "role" SET DEFAULT E'OBSERVER';
