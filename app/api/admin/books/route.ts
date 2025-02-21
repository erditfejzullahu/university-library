import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    try {
        const {searchParams} = new URL(req.url)
        type requestType = "Books" | "BorrowBooks" | "CountBooks" | "CountBorrowBooks"
        const type = searchParams.get("type") as requestType | null;

        if(!type) {
            return NextResponse.json({message: "type error"}, {status: 500})
        }

        let books = null;

        if(type === "Books"){
            books = await prisma.books.findMany();
        }else if(type ===  "BorrowBooks"){
            books = await prisma.borrowedBooks.findMany();
        }else if (type === "CountBooks"){
            books = await prisma.books.count();
        }else if(type === "CountBorrowBooks"){
            books = await prisma.borrowedBooks.count();
        }

        return NextResponse.json({books ,message: "Operation completed successfully"}, {status: 200})
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}