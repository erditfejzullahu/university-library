-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('WELCOME', 'REMINDER', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "EmailSent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
