import Link from 'next/link'
import React from 'react'
import BookCover from './BookCover'
import { cn } from '@/lib/utils'

const BookCard = ({id, title, genre, coverColor, coverUrl, isLoanedBook = false}: Book) => {
    
    return (
    <li className={cn("", isLoanedBook && "xs:w-52 w-full")}>
        <Link href={`/books/${id}`} className={cn("" ,isLoanedBook && "w-full flex flex-col items-center")}>
                <BookCover coverColor={coverColor} coverUrl={coverUrl}/>

            <div>
                <p className="book-title">{title}</p>
            </div>
        </Link>
    </li>
    )
}

export default BookCard