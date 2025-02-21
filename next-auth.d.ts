import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        universityId: number;
        universityIdCard: string;
        verified: boolean;
    }

    interface Session {
        user: User
    }

    interface JWT  {
        universityId: number;
        universityIdCard: string;
        verified: boolean;
    }
}