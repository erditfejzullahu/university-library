import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer"; // or resend

const prisma = new PrismaClient();

interface Props{
    fullName: string;
    email: string;
}

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "murrizisolutions@gmail.com",
        pass: process.env.BREVO_SECRET_KEY
    }
})

const sendEmail = ({fullName, email}: Props) => {
    const mailOptions = {
        from: "info@murrizi.org",
        to: email,
        subject: "Test email",
        text: "Test test"
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.error(`error sendind mail ${error}`);
        }else{
            console.log(`mail send to ${email}: ${info.response}`);
        }
    })
}

export const checkUserLogins = async () => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        const twoDaysAgoIsoString = twoDaysAgo.toISOString();

        const users = await prisma.user.findMany({
            where: {
                lastActivity: {
                    lte: twoDaysAgoIsoString
                }
            }
        })
        
        if(users.length > 0){
            console.log(`${users.length} users found that has not logged in in 2 days`);
            for(const user of users){
                sendEmail({fullName: user.fullName, email: user.email});
            }
        }else{
            console.log("no users");
            
        }
    } catch (error) {
        console.error(error);
        
    } finally {

    }
}