/*
  Warnings:

  - Added the required column `coverUrl` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "coverUrl" TEXT NOT NULL;
