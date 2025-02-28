-- DropForeignKey
ALTER TABLE "BorrowedBooks" DROP CONSTRAINT "BorrowedBooks_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BorrowedBooks" DROP CONSTRAINT "BorrowedBooks_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmailSent" DROP CONSTRAINT "EmailSent_userId_fkey";

-- AddForeignKey
ALTER TABLE "BorrowedBooks" ADD CONSTRAINT "BorrowedBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBooks" ADD CONSTRAINT "BorrowedBooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
