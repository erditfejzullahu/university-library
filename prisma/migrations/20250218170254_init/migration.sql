/*
  Warnings:

  - You are about to drop the column `Genre` on the `Books` table. All the data in the column will be lost.
  - Added the required column `genre` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" DROP COLUMN "Genre",
ADD COLUMN     "genre" TEXT NOT NULL;
