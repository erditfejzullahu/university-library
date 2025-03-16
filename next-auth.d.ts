import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
type Role = "ADMIN" | "USER"
declare module "next-auth" {
    interface User {
        universityId: number;
        universityIdCard: string;
        verified: boolean;
        role: Role;
        profileImage: string;
    }

    interface Session {
        user: User
    }

}

declare module "next-auth/jwt" {
    
    interface JWT {
        universityId: number;
        universityIdCard: string;
        verified: boolean;
        role: Role;
        profileImage: string;
    }
}