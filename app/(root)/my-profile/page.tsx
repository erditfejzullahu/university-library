import { auth, signOut } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import React from 'react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { icons } from '@/constants'
import BorrowedBooksList from '@/components/BorrowedBooksList'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import config from '@/lib/config'
import { getInitials } from '@/lib/utils'
import ProfileImageUploads from '@/components/ProfileImageUploads'

const page = async () => {
  const session = await auth();
  const borrowedBooks = await prisma.borrowedBooks.findMany({
    where: {userId: session?.user?.id},
    include: {
      book: true
    }
  })
  
  return (
    <>
      <section className="flex flex-row gap-14 flex-1 max-lg:flex-col">
        <aside className="bg-dark-300 shadow-xl shadow-black relative flex-[0.60] h-fit rounded-xl max-lg:max-w-fit mx-auto max-[460px]:flex-1 max-[460px]:max-w-full max-[460px]:w-full">
          <Image src={icons.cardTopPointer} width={40} alt='corpse' className="absolute left-0 -top-4 right-0 mx-auto"/>
          <div className="mx-6 mb-6 flex flex-col gap-8 mt-20">
            {/* img details */}
            <div className="flex flex-row items-center gap-4 max-[460px]:flex-col">
              <div className="rounded-full p-2 bg-dark-600">
                <ProfileImageUploads/>
              </div>

              <div className="flex flex-col items-start gap-1 max-[460px]:items-center">
                <div className="flex flex-row gap-1 items-center">
                  <Image src={session?.user.verified ? icons.verifiedIcon : icons.warning} width={20} height={20} alt="asd"/>
                  <span className="text-light-100 text-sm font-ibm-plex-sans">{session?.user.verified ? "Student i verifikuar" : "Student i paverifikuar"}</span>
                </div>
                <div>
                  <span className="text-white font-semibold text-lg font-ibm-plex-sans">{session?.user?.name?.split(" ")[0]}</span>
                </div>
                <div>
                  <span className="text-light-100 text-sm font-ibm-plex-sans">{session?.user?.email}</span>
                </div>
              </div>
            </div>

            <div className="max-[460px]:flex max-[460px]:flex-col max-[460px]:items-center">
              <p className="text-light-100 font-ibm-plex-sans">Universiteti</p>
              <p className="text-white text-lg font-semibold font-ibm-plex-sans">Murrizi Labs</p>
            </div>

            <div className="max-[460px]:flex max-[460px]:flex-col max-[460px]:items-center">
              <p className="text-light-100 font-ibm-plex-sans">ID e Studentit</p>
              <p className="text-white text-lg font-semibold font-ibm-plex-sans">{session?.user.universityId}</p>
            </div>

            <div className="">
              <img src={config.env.imagekit.urlEndpoint + session?.user.universityIdCard} alt='university card' className="contain h-auto w-full bg-dark-500 rounded-lg shadow-lg shadow-black"/>
            </div>

          </div>
        </aside>
        <div className="flex-1 grid grid-cols-2 max-sm:grid-cols-1 gap-6">
          {borrowedBooks.map((borrowed) => (
            <BorrowedBooksList key={borrowed.id} bookItem={borrowed}/>
          ))}
        </div>
      </section>
    </>
  )
}

export default page