/*
  Warnings:

  - Added the required column `returnDate` to the `BorrowedBooks` table without a default value. This is not possible if the table is not empty.
  - Made the column `dueDate` on table `BorrowedBooks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BorrowedBooks" ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "dueDate" SET NOT NULL;
