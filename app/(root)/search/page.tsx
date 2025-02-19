import React from 'react'
import { prisma } from '@/lib/prisma'
import BookList from '@/components/BookList';
import SearchForm from '@/components/SearchForm';


const page = async ({searchParams}: {searchParams: Promise<{query?: string}>}) => {
    const query = (await searchParams).query;    
    
    const books = await prisma.books.findMany({
        where: query ? {
            OR: [
                {
                        title: {
                            contains: query.trim(),
                            mode: "default"
                        },
                },
                {
                        author: {
                            contains: query,
                            mode: "insensitive"
                        }
                },
                {
                        genre: {
                            contains: query,
                            mode: "insensitive"
                        }
                },
            ],
        } : {},
        include: {
            borrowedBooks: true
        }
    })        

  return (
    <section className="flex-1">
        <div className="my-10 items-center justify-center flex flex-col">
            <h4 className="uppercase text-white font-ibm-plex-sans text-center text-lg">Zbulo lexime te reja:</h4>
            <h1 className="text-white font-ibm-plex-sans font-semibold text-center md:text-5xl text-2xl max-w-2xl">Zbulo dhe Shfleto te <span className="text-primary">gjithe librat </span>qe kemi ne librari!</h1>
        </div>
        <div>
            <SearchForm query={query}/>
        </div>
        <div>
            <div>
                <BookList title={query ? "Rezultatet e kerkimit" : "Librat e fundit"} books={books}/>
            </div>
        </div>
    </section>
  )
}

export default page