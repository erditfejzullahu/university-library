import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function DELETE(req: Request, {params} : {params: {id: string}}){
    try {
        const id = params.id;
        type bookType = "Book" | "BorrowBook"
        const {searchParams} = new URL(req.url);
        const type = searchParams.get("type") as bookType;

        
        let book = null;
        
        if(type === "Book"){
            book = await prisma.books.delete({
                where: {id}
            })
        }else if(type === "BorrowBook"){
            book = await prisma.borrowedBooks.delete({
                where: {id}
            })
        } else {
            return NextResponse.json({message: "Invalid type"}, {status: 500})
        }

        return NextResponse.json({message: "Operation completed successfully"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "something went wrong"}, {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: {id: string}}){
    try {
        const id = params.id;
        let body = null;
        type patchType = "Book" | "BorrowedBook"
        const {searchParams} = new URL(req.url);

        const bookType = searchParams.get("type") as patchType

        if(bookType === "Book"){
            body = await req.json() as Book;
            await prisma.books.update({
                where: {id},
                data: {...body}
            })
        }else if (bookType === "BorrowedBook"){
            body = await req.json() as BorrowedBook;
            await prisma.borrowedBooks.update({
                where: {id},
                data: {
                    status: body.status,
                    returnDate: body.returnDate,
                }
            })
        } else{
            return NextResponse.json({message: "Invalid type"}, {status: 500})
        }

        return NextResponse.json({message: "Operation completed successfully"}, {status: 201});

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}