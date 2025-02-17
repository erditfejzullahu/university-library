import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local"
import {SessionProvider} from "next-auth/react"
import { auth } from "@/auth";

const ibmPlexSans = localFont({
  src: [
    { path: "./fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal"},
    { path: "./fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal"},
    { path: "./fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal"},
    { path: "./fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal"},
  ]
})

const bebasNeue = localFont({
  src: [
    {path: "./fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal"}
  ],
  variable: "--bebas-neue"
})

export const metadata: Metadata = {
  title: "ShokuLibrit",
  description: "ShokuLibrit eshte nje platforme e vetemesimit me ane te librave online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
