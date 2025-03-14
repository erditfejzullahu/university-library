import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(res: Request, {params}: {params: {id: string}}){
    try {
        const bookId = params.id;     //to accept param id from url
        console.log(bookId,  " ???");
        
        const {searchParams} = new URL(res.url);
        const borrowId = searchParams.get("borrowId");

        if(borrowId === null){
            return NextResponse.json({message: "borrowedBookId required"}, {status: 400})
        }

        await prisma.borrowedBooks.delete({where: {id: borrowId}})

        return NextResponse.json({message: "Borrowed Book Deleted successfully"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in deleting borrowed book"}, {status: 500})
    }
}