import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(){
    try {
        const users = await prisma.user.findMany({
            where: {
                status: "IN_REVIEW"
            }
        })

        if(users.length === 0){
            return NextResponse.json({message: "No user found"}, {status: 400})
        }

        return NextResponse.json({message: "Successfull", users}, {status: 200})
    } catch (error) {
        console.error("Error getting users", error instanceof Error ? error.message : error);
        return NextResponse.json({message: "Error getting users"}, {status: 500})
    }
}