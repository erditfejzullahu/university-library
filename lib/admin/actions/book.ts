"use server"
import { prisma } from "@/lib/prisma";
export const createBook = async (params: BookParams) => {
    console.log(params);
    
    try {
        const newBook = await prisma.books.create({
            data: params
        }) 

        return {success: true, data: newBook}
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "An error happened"
        }
    }
}