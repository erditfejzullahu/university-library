import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 15 * 1024 * 1024; //15MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const {id} = await params;

        if(!id) {
            return NextResponse.json({message: "No id provided"}, {status: 400})
        }

        const formData = await req.formData();
        const file = formData.get("photo") as File | null;
        
        if(!file){
            return NextResponse.json({message: "No file uploaded"}, {status: 400})
        }

        if(!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({message: "Invalid file type"}, {status: 400})
        }

        if(file.size > MAX_FILE_SIZE){
            return NextResponse.json({message: "File is too large"}, {status: 400});
        }

        const fileExtension = file.name.split(".").pop();
        const safeFileName = `${crypto.randomUUID()}.${fileExtension}`
        const uploadDir = path.join(process.cwd(), "public/uploads");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(path.join(uploadDir, safeFileName), buffer);
        const imageUrl = `/uploads/${safeFileName}`
        const savedImage = await prisma.user.update({
            where: {id},
            data: {
                profileImage: imageUrl
            }
        })
        return NextResponse.json({message: "File uploaded successfully", imageUrl: savedImage.profileImage}, {status: 200});

    } catch (error) {
        console.error("Error uploading photo", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({message: "Error uploading file"}, {status: 500})
    }
}
