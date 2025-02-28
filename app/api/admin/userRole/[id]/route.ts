import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";


export async function PATCH(req: NextRequest, {params}: {params: {id: string}}){
    try {
        const body = await req.json();
        const {role} = body;
    
        if(!role || typeof role !== "string" || !["ADMIN", "USER"].includes(role)){
            return NextResponse.json({message: "Role is required"}, {status: 400})
        }
    
        const id = params.id;
        await prisma.user.update({
            where: {id},
            data: {
                role: role as Role
            }
        })
    
        return NextResponse.json({message: "User Sucessfully changed role"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}