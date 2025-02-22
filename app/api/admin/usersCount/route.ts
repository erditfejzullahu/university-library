import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const users = await prisma.user.count();
        return NextResponse.json({users, message: "Operaction completed successfullt"}, {status: 200})
    } catch (error) {
        console.error();
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}