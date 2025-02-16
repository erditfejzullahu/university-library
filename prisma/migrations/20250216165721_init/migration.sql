-- CreateTable
CREATE TABLE "Books" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "author" TEXT NOT NULL,
    "Genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "totalCopies" INTEGER NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "coverColor" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
