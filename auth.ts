import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs";
import { rateLimiter } from "./lib/ratelimiter";

const prisma = new PrismaClient();

export const {handlers, signIn, signOut, auth} = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    return null
                }
                
                const user = await prisma.user.findUnique({where: {email: credentials.email.toString()}})
                if(!user){
                    return null
                }
                
                const isPasswordValid = await compare(credentials.password.toString(), user.password);

                if(!isPasswordValid){
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName
                }
            }
        })
    ],
    pages: {
        signIn: "/sign-in"
    },
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.sub = user.id,
                token.name = user.name,
                token.email = user.email
            }

            return token;
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.sub as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        }
    }
})