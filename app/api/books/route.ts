import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const books = await prisma.books.findMany();
        if(!books || books.length === 0){
            return NextResponse.json({message: "No books found"}, {status: 404})
        }
    
        return NextResponse.json(books);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in retriving books"}, {status: 404})
    }
}

export async function POST(res: Request) {
    const bookData = await res.json();
    try {
        if(!bookData){
            return NextResponse.json({message: "Missing data"}, {status: 400})
        }

        const newBook = await prisma.books.create({
            data: bookData
        })

        return NextResponse.json({newBook, message: "Book added successfully"}, {status:200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in adding book"}, {status:500})
    }
}
