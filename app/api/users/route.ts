import { NextResponse } from "next/server";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const type = searchParams.get("type") //get users by type
    
        let users;
    
        if(type === "withBorrowedBooks"){
            users = await prisma.user.findMany({
                include: {
                    borrowedBooks: {
                        include: {
                            book: true
                        }
                    }
                }
            })
        }else{
            users = await prisma.user.findMany();
        }
    
        if(users === null || users.length === 0){
            NextResponse.json({message: "No users found"}, {status: 404})
        }
    
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in retriving users"}, {status: 500})
    }
}
