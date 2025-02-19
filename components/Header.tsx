import Link from 'next/link'
import React from 'react'
import { BookOpenText, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { signOut } from '@/auth'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Session } from 'next-auth'
import TopBarLinks from './TopBarLinks'
import HamburgerMenu from './HamburgerMenu'

// export const ppr = true;

const Header = ({session}: {session: Session}) => {    
    
  return (
    <header className="my-10 flex justify-between gap-5 max-lg:my-6">
        <Link href={"/"} className="flex flex-row items-center gap-2">
            <BookOpenText className="text-white size-10"/>
            <span className="text-white font-bebas-neue text-2xl">ShokuLibrit</span>
        </Link>

        <ul className='flex flex-row items-center gap-8 max-[519px]:hidden'>
            <TopBarLinks />
            <li className="flex flex-row items-center gap-2">
                <Link href={"/my-profile"}>
                    <Avatar>
                        <AvatarFallback>
                            {getInitials(session.user?.name as string)}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <Link href={"/my-profile"} className="max-[600px]:hidden">
                    <p className='font-bebas-neue text-white mt-1 text-2xl'>{session.user?.name?.split(" ")[0]}</p>
                </Link>
            </li>
            <li className="mt-1">
                <form className="cursor-pointer" action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <button className="bg-transparent !p-0 !m-0" type='submit'>
                        <LogOut className="text-primary"/>
                    </button>
                </form>
            </li>
        </ul>

        <HamburgerMenu session={session}/>
    </header>
  )
}

export default Header