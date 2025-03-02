import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        type requestType = "Books" | "BorrowBooks" | "CountBooks" | "CountBorrowBooks"
        const type = req.nextUrl.searchParams.get("type") as requestType | null;
        const page = Number(req.nextUrl.searchParams.get('page') || 0);
        const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || 0);        
        
        if(!type) {
            return NextResponse.json({message: "type error"}, {status: 500})
        }

        let book;
        let totalCount;

        if(type === "Books"){
            if(page === 0 && pageSize === 0){
                const [data, count] = await Promise.all([
                    prisma.books.findMany(),
                    prisma.books.count()
                ])
                book = data;
                totalCount = count
            }else{
                const [data, count] = await Promise.all([
                    prisma.books.findMany({
                        skip: (page - 1) * pageSize,
                        take: pageSize
                    }),
                    prisma.books.count()
                ])
                book = data;
                totalCount = count;
            }
        }else if(type ===  "BorrowBooks"){
            if(page === 0 && pageSize === 0){
                const [data, count] = await Promise.all([
                    prisma.borrowedBooks.findMany({
                        include: {book: true, user: true}
                    }),
                    prisma.borrowedBooks.count()
                ])
                book = data;
                totalCount = count
            }else{
                const [data, count] = await Promise.all([
                    prisma.borrowedBooks.findMany({
                        skip: (page - 1) * pageSize,
                        take: pageSize,
                        include: {book: true, user: true}
                    }),
                    prisma.borrowedBooks.count()
                ])
                book = data;
                totalCount = count;
            }
        }else if (type === "CountBooks"){
            book = await prisma.books.count();
            totalCount = book;
        }else if(type === "CountBorrowBooks"){
            book = await prisma.borrowedBooks.count();
            totalCount = book
        }
        
        const totalPages = type === "Books" || type === "BorrowBooks" ? Math.ceil(totalCount! / pageSize) : null

        return NextResponse.json(
            { 
                book,
                message: "Operation completed successfully",
                currentPage: page,
                totalPages: (page > 0 && pageSize > 0) ? totalPages : totalCount //nese ska pagination show totalcount
            }, 
            {status: 200}
        )
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}