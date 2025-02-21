import {getToken} from "next-auth/jwt"
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
    const token = await getToken({req, secret: process.env.AUTH_SECRET})
    console.log(token);

    if(!token){
        return NextResponse.json(new URL('/sign-in', req.url))
    }

    if(token.role !== "ADMIN"){
        return NextResponse.json({message: "Forbidden: You do not have access to this resource"}, {status: 403})
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/admin/*'],
}