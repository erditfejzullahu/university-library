/*
  Warnings:

  - Changed the type of `universityId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_universityId_key" ON "User"("universityId");
