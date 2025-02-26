import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {omit} from "lodash"

export async function GET(){
    try {
        const usersData = await prisma.user.findMany({
            include: {
                borrowedBooks: true
            }
        })
        
        if(usersData.length === 0){
            return NextResponse.json({message: "No users found"}, {status: 404});
        }
        const users = usersData.map((user) => ({
            ...omit(user, ["password"]),
            borrowedBooks: user.borrowedBooks.length
        }))
        console.log(users);
        

        return NextResponse.json({users, message: "Operacion completed successfully"}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}