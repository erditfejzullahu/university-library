/*
  Warnings:

  - Added the required column `status` to the `BorrowedBooks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BorrowedStatus" AS ENUM ('BORROWED', 'RETURNED');

-- AlterTable
ALTER TABLE "BorrowedBooks" ADD COLUMN     "status" "BorrowedStatus" NOT NULL;
