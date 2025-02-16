import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(res: Request) {
    try {
        const {id, ...updateData} = await res.json();

        if(!id){
            return NextResponse.json({message: "userId is required"}, {status: 400})
        }

        const updateUser = await prisma.user.update({
            where: {id},
            data: updateData
        })

        return NextResponse.json({message: "User updated successfully"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in updating user"}, {status: 400})
    }
}

export async function DELETE(res: Request) {
    try {
        const {searchParams} = new URL(res.url);
        const userId = searchParams.get("userId");

        if(!userId){
            return NextResponse.json({message: "UserId is required"}, {status: 400});
        }

        await prisma.user.delete({where: {id: userId}});

        return NextResponse.json({message: "User deleted successfully"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error in deleting user"}, {status:200})
    }
}