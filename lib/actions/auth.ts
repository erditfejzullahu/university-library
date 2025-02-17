"use server"

import { signIn } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { headers } from "next/headers";
import { rateLimiter } from "../ratelimiter";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
    const {email, password} = params

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await rateLimiter(ip);

    if(!isAllowed) return redirect('/too-fast');

    try {
        const result = await signIn("credentials", {email, password, redirect: false})

        if(result?.error){
            return {success: false, error: result.error}
        }

        return {success: true}
    } catch (error) {
        console.error(error);
        return {success: false, error: "sign in error"}
    }
}

export const signUp = async (params: AuthCredentials) => {
    const {fullName, email, universityId, password, universityIdCard} = params;    

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await rateLimiter(ip);

    if(!isAllowed) return redirect('/too-fast');
    //check if user exist
    const existingUser = await prisma.user.findUnique({where: {email}})
    
    
    if(existingUser !== null){
        return {success: false, error: "user already exists"}
    }

    const hashedPassword = await hash(password, 10);    

    try {
        await prisma.user.create({
            data: {
                fullName,
                email,
                universityId,
                universityIdCard,
                password: hashedPassword
            }
        })

        await signInWithCredentials({email, password});

        return {success: true};
    } catch (error) {
        console.error(error, " signup error");
        return {success: false, error: "signup error"}
    }
}