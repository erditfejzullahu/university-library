import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function PATCH(req: NextRequest, {params}: {params: {id: string}}){
    try {
        const body = await req.json();
        const {roleStatus} = body;
        if(!roleStatus || typeof roleStatus !== "string" || !["IN_REVIEW", "ACCEPTED"].includes(roleStatus)){
            return NextResponse.json({message: "Role status invalid"}, {status: 400})
        }

        const {id} = await params;
        if(!id){
            return NextResponse.json({message: "No id provided"}, {status: 200})
        }

        const existingUser = await prisma.user.findUnique({where: {id}})
        if(existingUser === null){
            return NextResponse.json({message: "No user found"}, {status: 404})
        }

        await prisma.user.update({
            where: {id},
            data: {
                status: roleStatus as Status
            }
        })

        return NextResponse.json({message: "User status updated successfully"}, {status: 200})
    } catch (error) {
        console.error("Error updating user status: ", error instanceof Error ? error.message : "Error updating user status");
        return NextResponse.json({message: "Error updating user"}, {status: 500})
    }
}