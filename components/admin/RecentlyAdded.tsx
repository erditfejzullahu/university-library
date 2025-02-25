import { icons } from '@/constants'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BookListAdmin from './BookListAdmin'
import { prisma } from '@/lib/prisma'

const RecentlyAdded = async ({session}: {session: Session | null}) => {
  const books = await prisma.books.findMany({
    take: 6
  })
  return (
    <div className="flex-1 bg-white rounded-lg p-4 gap-4">
        <div className="flex flex-row justify-between items-center">
            <div>
                <span className="text-xl  text-dark-100 font-semibold">Librat e shtuar se fundmi</span>
            </div>
            <div>
                <Link href={"/admin/all-borrow-requests"} className="bg-light-300 text-primary-admin font-medium py-1.5 px-4 rounded-lg text-sm">Shiko te gjitha</Link>
            </div>
        </div>
        <Link href={"/admin/books/new"} className="bg-light-300 rounded-lg flex-1 mt-4 flex flex-row items-center gap-4 p-4">
          <div className="bg-white rounded-full self-start p-3">
            <Image src={icons.plus} width={20} height={20} alt='plus'/>
          </div>
          <div>
            <p className="text-lg text-black font-ibm-plex-sans">Shto nje liber te ri</p>
          </div>
        </Link>
        <div className="mt-4 after:pointer-events-none after:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:admin-list">
          {books.map((item) => (
            <Link key={item.id} href={item.id}>
              <BookListAdmin  session={session} type="Book" request={item}/>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default RecentlyAdded