import { icons } from '@/constants'
import config from '@/lib/config'
import Image from 'next/image'
import React from 'react'
import BookCover from '../BookCover'
import { Session } from 'next-auth'

interface PropsBook {
  type: "Book",
  session: Session | null,
  request: Book
}

interface PropsBorrowed {
  type: "BorrowedBook",
  session: Session | null,
  request: BorrowedBook
}

type Props = PropsBorrowed | PropsBook

const BookListAdmin = ({request, session, type}: Props) => {
    const borrowDate = new Date(type === "BorrowedBook" ? request.borrowedAt : request.createdAt);
    const outputBorrowDate = borrowDate.toLocaleDateString("sq-AL", {
      day: "numeric",
      month: "numeric",
      year: "2-digit"
    })
  return (
    <div className="flex flex-row justify-between items-start bg-light-300 rounded-lg p-4 mb-4">
        <div className="flex flex-row items-center gap-4">
          <div>
            <BookCover coverUrl={type === "BorrowedBook" ? request.book.coverUrl : request.coverUrl} coverColor={type === "BorrowedBook" ? request.book.coverColor : request.coverColor} variant="small" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{type === "BorrowedBook" ? request.book.title : request.title}</h3>
            <p className="text-light-500 text-xs">Nga {type === "BorrowedBook" ? request.book.author : request.author} * {type === "BorrowedBook" ? request.book.genre : request.genre}</p>
            <div className="flex flex-row items-center gap-4 mt-2">
              <p className="text-gray-600 text-xs font-ibm-plex-sans">{session?.user.name}</p>
              <p className="flex flex-row items-center">
                <Image src={icons.adminCalendar} width={15} height={15} alt='calendar'/>
                <span className="text-gray-600 text-xs font-ibm-plex-sans">{outputBorrowDate}</span>
              </p>
            </div>
          </div>
        </div>
        <div>
            <Image src={icons.eye} alt='eye' width={30} height={30} className="bg-white rounded-sm p-1.5"/>
        </div>
    </div>
  )
}

export default BookListAdmin