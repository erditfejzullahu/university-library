"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn, getInitials } from '@/lib/utils'
import { BookOpenText } from 'lucide-react'
import { Button } from './ui/button'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback } from './ui/avatar'


const Header = ({session}: {session: Session | null}) => {
    console.log(session);
    
    const pathanme = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
        <Link href={"/"} className="flex flex-row items-center gap-2">
            <BookOpenText className="text-white size-10"/>
            <span className="text-white font-bebas-neue text-2xl">ShokuLibrit</span>
        </Link>

        <ul className='flex flex-row items-center gap-8'>
            <li>
                <Link href={"/library"} className={cn("text-base cursor-pointer capitalize font-bebas-neue", pathanme === "/library" ? "text-light-200" : "text-light-100")}>Library</Link>
            </li>
            <li>
                <Link href={'/my-profile'}>
                    <Avatar>
                        <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name as string)}</AvatarFallback>
                    </Avatar>
                </Link>
            </li>
        </ul>
    </header>
  )
}

export default Header