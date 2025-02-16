import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const borrowedBooks = await prisma.borrowedBooks.findMany({
            include: {book: true}
        });

        if(borrowedBooks.length === 0){
            return NextResponse.json({message: "No borrowed books found"}, {status: 404});
        }

        return NextResponse.json(borrowedBooks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error retriving borrowed books"}, {status: 400})
    }
}

export async function POST(res: Request){
    const body = await res.json();
    try {

        const newBorrowBook = await prisma.borrowedBooks.create({
            data: body
        })

        return NextResponse.json({newBorrowBook, message: "Book borrowed successfully"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in creating book"}, {status: 400})
    }
}