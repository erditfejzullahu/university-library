"use server"
import { prisma } from "../prisma";
import dayjs from "dayjs"
export const borrowBook = async (params: BorrowBookParams) => {
    const {bookId, userId} = params;

    try {
        const book = await prisma.books.findUnique({
            where: {id: bookId},
            select: {availableCopies: true}
        })

        if(book === null || book.availableCopies === 0){
            return {success: false, error: "Libri nuk eshte i disponueshem"}
        }

        const dueDate = dayjs().add(7, "day").toDate().toISOString();

        const record = await prisma.borrowedBooks.create({
            data: {
                userId,
                bookId,
                dueDate
            }
        })

        await prisma.books.update({
            where: {id: bookId},
            data: {availableCopies: {decrement: 1}}
        });

        return {success: true, data: record}
    } catch (error) {
        console.error("Error details:", error instanceof Error ? error.stack : error);

        return {success: false, error: "Dicka shkoi gabim ne huazim te librit"}
    }
}