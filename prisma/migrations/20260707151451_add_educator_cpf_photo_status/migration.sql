-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
