import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request){
    try {
        const {searchParams} = new URL(req.url)
        const bookId = searchParams.get("bookId");

        if(!bookId){
            return NextResponse.json({message: "bookId is required"}, {status: 400})
        }

        await prisma.books.delete({
            where: {id: bookId}
        })

        return NextResponse.json({message: "Book deleted successfully"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in deleting book"}, {status: 400});
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const {id, ...otherData} = body;

        if(!id){
            return NextResponse.json({message: "BookId is required"}, {status: 400})
        }

        await prisma.books.update({
            where: {id},
            data: {
                ...otherData
            }
        })

        return NextResponse.json({message: "Data updated successfully"}, {status: 200});

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in updating users"}, {status: 500});
    }
}