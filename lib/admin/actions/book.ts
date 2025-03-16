"use server"
import { prisma } from "@/lib/prisma";
export const createBook = async (params: BookParams) => {    
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

export const editBook = async (params: BookParams) => {
    try {
        const editBook = await prisma.books.update({
            where: {title: params.title},
            data: {...params}
        })

        return {success: true, data: editBook}
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "An error happened"
        }
    }
}