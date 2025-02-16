import { NextResponse } from "next/server";
import {PrismaClient} from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const saltRounds = 10

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
    
        if(!users || users.length === 0){
            NextResponse.json({message: "No users found"}, {status: 404})
        }
    
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in retriving users"}, {status: 500})
    }
}

export async function POST(res: Request){
    const {password, ...bodyData} = await res.json();

    console.log(bodyData, " bodydata");
    
    try {
        if(!password || !bodyData.email){
            return NextResponse.json({message: "Missing data"}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await prisma.user.create({
            data: {
                password: hashedPassword,
                ...bodyData
            }
        })

        return NextResponse.json({message: "User created successfully"}, {status:200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in creating user"}, {status: 500}) 
    }
}