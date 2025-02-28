import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request, {params}: {params: {id: string}}) {
    try {
        const {...updateData} = await req.json();
        const id = params.id;
        if(id === null){
            return NextResponse.json({message: "userId is required"}, {status: 400})
        }

        const updateUser = await prisma.user.update({
            where: {id},
            data: updateData
        })

        return NextResponse.json({updateUser, message: "User updated successfully"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in updating user"}, {status: 400})
    }
}

export async function DELETE(req: Request, {params}: {params: {id:string}}) {
    try {
        const {id} = await params;
        console.log(id);
        
        if(!id){
            return NextResponse.json({message: "UserId is required"}, {status: 400});
        }

        const existingUser = await prisma.user.findUnique({ where: { id } });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await prisma.user.delete({where: {id}});

        return NextResponse.json({message: "User deleted successfully"}, {status: 200})
    } catch (error) {
        console.error("Error deleting user:", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({message: "Error in deleting user"}, {status:500})
    }
}