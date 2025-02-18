import Link from 'next/link'
import React from 'react'
import { BookOpenText } from 'lucide-react'
import { Button } from './ui/button'
import { signOut } from '@/auth'

const Header = () => {    
  return (
    <header className="my-10 flex justify-between gap-5">
        <Link href={"/"} className="flex flex-row items-center gap-2">
            <BookOpenText className="text-white size-10"/>
            <span className="text-white font-bebas-neue text-2xl">ShokuLibrit</span>
        </Link>

        <ul className='flex flex-row items-center gap-8'>
            <li>
                <form className="mb-10" action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <Button>Shkycuni</Button>
                </form>
            </li>
        </ul>
    </header>
  )
}

export default Header