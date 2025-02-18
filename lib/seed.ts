import ImageKit from "imagekit";
import dummyBooks from "../dummyBook.json"
import {config} from "dotenv"
import { prisma } from "./prisma";

config({path: ".env.local"})

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
})

const uploadToImageKit = async (url: string, fileName: string, folder: string) => {
    try {
        const response = await imageKit.upload({
            file: url,
            fileName,
            folder
        })

        return response.filePath
    } catch (error) {
        console.error("Error uploading images");
    }
}

const seed = async () => {
    console.log("seeding data...");
    try {
        for(const book of dummyBooks){
            const coverUrl = await uploadToImageKit(book.coverUrl, `${book.title}.jpg`, "/books/covers") as string

            const videoUrl = await uploadToImageKit(book.videoUrl, `${book.title}.mp4`, "/books/videos") as string

            await prisma.books.createMany({
                data: {
                    ...book,
                    coverUrl,
                    videoUrl
                }
            })
        }
        console.log("data added succesfully")
    } catch (error) {
        console.error("Error seeding data...");
    }
}

seed();