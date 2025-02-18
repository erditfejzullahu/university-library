import { emailMessages } from "@/utils/emailMessages";
import nodemailer from "nodemailer"
import { prisma } from "./prisma";
import { SentMessageInfo } from "nodemailer";

interface Props {
    fullName: string;
    email: string;
    type: "WELCOME" | "REMINDER" | "PASSWORD_RESET";
    id: string;
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

export const sendNecessaryEmail = async ({fullName, email, type, id}: Props) => {
    const message = emailMessages[type];

    const personalizedMessage = message.text.replace("{name}", fullName);

    const mailOptions = {
        from: "info@murrizi.org",
        to: email,
        subject: message.subject,
        text: personalizedMessage
    }

    try {
        const info = await new Promise<SentMessageInfo>((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.error(`error sendind mail ${error}`);
                    reject(error)
                }else{
                    resolve(info);
                }
            })
        })
        console.log(`mail send to ${email}: ${info.response}`);

        await prisma.emailSent.create({
            data: {
                userId: id,
                from: "info@murrizi.org",
                to: email,
                type,
                subject: message.subject,
                message: personalizedMessage
            }
        });
    } catch (error) {
        console.error(`error sending email ${error}`);
    }

}