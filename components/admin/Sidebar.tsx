"use client"
import { adminSideBarLinks } from '@/constants'
import { cn, getInitials } from '@/lib/utils'
import { BookOpenText, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

const Sidebar = ({session}: {session: Session}) => {
    const pathname = usePathname();
  return (
    <div className="admin-sidebar">
        <div>
            <div className="logo">
                <BookOpenText className="text-primary-admin size-10"/>
                <span className="text-black font-bebas-neue text-2xl">ShokuLibrit</span>
            </div>

            <div className="mt-10 flex flex-col gap-5">
                {adminSideBarLinks.map((link) => {
                    const isSelected = (link.route === 'admin' && pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link href={link.route} key={link.route}>
                            <div className={cn("link", isSelected && "bg-primary-admin shadow-sm")}>
                                <div className="relative size-5">
                                    <Image src={link.img} alt='icon' fill className={`${isSelected ? "brightness-0 invert": ""} object-contain`}></Image>
                                </div>
                                <p className={cn(isSelected ? "text-white" : "text-dark")}>{link.text}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>

        <div className="user">
            <Avatar>
                <AvatarFallback>
                    {getInitials(session?.user?.name as string)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col max-md:hidden">
                <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                <p className="text-light-500 text-xs">{session?.user?.email}</p>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => signOut()}>
                <LogOut />
            </div>
        </div>
    </div>
  )
}

export default Sidebar