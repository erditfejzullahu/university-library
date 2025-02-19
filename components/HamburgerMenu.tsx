"use client"
import { hamburgerLinks } from '@/constants'
import { cn, getInitials } from '@/lib/utils'
import { Session } from 'next-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Books } from '@prisma/client'
import { Skeleton } from './ui/skeleton'
import { GiHamburgerMenu } from "react-icons/gi";

const HamburgerMenu = ({session}: {session: Session}) => {
    const pathname = usePathname();
    const [isOpened, setIsOpened] = useState(false)
    const [booksData, setBooksData] = useState<Book[]>([])
    const [bookLoading, setBookLoading] = useState(false)

    useEffect(() => {
        if(isOpened){
            const fetchBooks = async () => {
                setBookLoading(true)
                try {
                    const response = await fetch('/api/books')
                    if(response.ok){
                      const data = await response.json();
                      console.log(data);
                      
                        setBooksData(data)
                    }
                } catch (error) {
                    console.error(error);
                    
                } finally {
                    setBookLoading(false)
                }
            }
            fetchBooks();
        }
    }, [isOpened])    
    
  return (
    <>
    <div className="min-[520px]:hidden block">
        <GiHamburgerMenu className={`text-white size-8 transition-all  ${isOpened ? "rotate-90" : "rotate-0"} `} onClick={() => setIsOpened(!isOpened)}/>
    </div>

        {isOpened && <div className={`fixed left-0 top-0 min-h-screen min-w-[100vw] bg-black bg-opacity-50 border z-[100] animate-fadeIn min-[520px]:hidden block ${!isOpened && "animate-fadeOut"}`} 
        onClick={() => {
            setIsOpened(false);
        }}
        >
            <div 
                className="bg-dark-100 flex-1 w-[80%] flex flex-col justify-between ml-auto p-2 z-[110] shadow-lg !shadow-slate-950 min-h-screen px-4"
                onClick={(e) => e.stopPropagation()}    
            >
                <div>
                    <div className="items-center justify-center content-center flex flex-col gap-3 p-6 mt-4">
                        <div>
                            <Avatar className="m-auto">
                                <AvatarFallback className="bg-primary text-black font-bebas-neue text-xl">
                                    <div>{getInitials(session?.user?.name as string)}</div>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="items-center flex">
                            <span className="font-bebas-neue text-white text-[30px] text-center">{session?.user?.name}</span>
                        </div>
                    </div>
                    <ul className="flex flex-col items-center justify-center mt-4">
                        {hamburgerLinks.map((item, i) => (
                            <li key={i}>
                            <Link
                            className={cn(
                                "relative font-bebas-neue text-2xl leading-10 text-light-100 transition-all",
                                "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:transition-all after:duration-300",
                                "hover:after:scale-x-100 line-clamp-1",
                                pathname === item.link ? "!text-primary" : ""
                            )}
                            href={item.link}
                            >
                            {item.label}
                            </Link>
                        </li>                  
                        ))}
                    </ul>
                </div>

                
                <div className="">
                    <span className="text-4xl font-bebas-neue font-bold text-white">Shfletoni libra</span>
                    <ul className="border-t border-primary py-2 flex gap-2 max-w-[300px] flex-wrap">
                        {bookLoading ? (
                            <Skeleton className="w-full h-20 mb-1"/>
                        ) : (
                            booksData.map((book) => (
                                <li key={book.id} className="">
                                    <Link href={`/books/${book.id}`} className=" py-1 p-2 bg-primary rounded-[5px] text-dark-100 font-bebas-neue self-start text-base">{book.title}</Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>}
    </>
  )
}

export default HamburgerMenu
