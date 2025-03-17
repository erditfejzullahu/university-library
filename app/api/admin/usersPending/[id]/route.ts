import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { omit } from "lodash";

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const {id} = await params;
        const body = await req.json();
        if(!id || id === null){
            return NextResponse.json({message: "Missing id"}, {status: 400})
        }
        
        const updateUser = await prisma.user.update({
            where: {id},
            data: {
                status: "ACCEPTED"
            }
        })

        const user = omit(updateUser, ["password"])

        return NextResponse.json({message: "Success", user}, {status:200})
    } catch (error) {
        console.error("Error updating user status: ", error instanceof Error ? error.message : error);
        return NextResponse.json({message: "Error updating user"}, {status: 500})
    }
}