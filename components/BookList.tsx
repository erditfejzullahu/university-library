import React from 'react'
import BookCard from './BookCard';

interface Props {
  title: string;
  books: Book[];
  containerClassName?:string;
  queryTitle?: string
}

const BookList = ({title, books, containerClassName, queryTitle}: Props) => {  
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title} {queryTitle && <span className="text-primary">{queryTitle}</span>}</h2>

      <ul className="book-list">
        {books.map((item) => (
          <BookCard key={item.title} {...item}/>
        ))}
      </ul>
    </section>
  )
}

export default BookList