import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import BookCover from './BookCover'
import BorrowButton from './BorrowButton'
import { prisma } from '@/lib/prisma'

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({title, author, genre, rating, totalCopies, description, availableCopies, coverColor, coverUrl, id, userId}: Props) => {
  const user = await prisma.user.findUnique({
    where: {id: userId}
  })

  if(user === null) return null; 

  const borrowEligbility = {
    isEligible: availableCopies > 0 && user.status === "ACCEPTED",
    message: availableCopies <= 0 ? "Nuk mund te huazosh kete liber" : "Sapo huazove kete liber"
  }


  return (
    <section className="book-overview !overflow-x-hidden">
        <div className="flex flex-1 flex-col gap-5">
            <h1>{title}</h1>
            <div className="book-info">
              <p>Nga <span className="font-semibold text-light-200">{author}</span></p>

              <p>Kategoria <span className="font-semibold text-light-200">{genre}</span></p>

              <div className="flex flex-row gap-1">
                <Image src={"/icons/star.svg"} alt='stars' width={22} height={22} />
                <p className="text-light-200 font-semibold">{rating}</p>
              </div>
            </div>

            <div className="book-copies">
              <p>
                Te gjithe kopjet: <span>{totalCopies}</span>
              </p>
              <p>
                Librat ne dispozicion: <span>{availableCopies}</span>
              </p>
            </div>

            <p className="book-description">{description}</p>

            <BorrowButton bookId={id} userId={userId} borrowEligbility={borrowEligbility}/>
        </div>

        <div className='relative flex flex-1 justify-center'>
          <div className="relative">
            <BookCover variant="wide" className="z-10" coverColor={coverColor} coverUrl={coverUrl}/>

            <div className="absolute left-16 top-10 rotate-12 opacity-40">
              <BookCover variant="wide" coverColor={coverColor} coverUrl={coverUrl}/>
            </div>
          </div>
        </div>
    </section>
  )
}

export default BookOverview