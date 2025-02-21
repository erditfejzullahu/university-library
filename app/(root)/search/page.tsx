import React from 'react'
import { prisma } from '@/lib/prisma'
import BookList from '@/components/BookList';
import SearchForm from '@/components/SearchForm';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResetButton from '@/components/ResetButton';


const page = async ({searchParams}: {searchParams: Promise<{query?: string}>}) => {
    const query = (await searchParams).query;    
    
    const books = await prisma.books.findMany({
        where: query ? {
            OR: [
                {
                        title: {
                            contains: query.trim(),
                            mode: "insensitive"
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
console.log(books);

  return (
    <section className="flex-1 !w-full">
        <div className="my-10 items-center justify-center flex flex-col">
            <h4 className="uppercase text-white font-ibm-plex-sans text-center text-lg">Zbulo lexime te reja:</h4>
            <h1 className="text-white font-ibm-plex-sans font-semibold text-center md:text-5xl text-2xl max-w-2xl">Zbulo dhe Shfleto te <span className="text-primary">gjithe librat </span>qe kemi ne librari!</h1>
        </div>
        <div>
            <SearchForm query={query}/>
        </div>
        <div>
            <div>
                <BookList title={query ? `Rezultatet e kerkimit:` : "Librat e fundit"} books={books} queryTitle={query}/>
            </div>
        </div>
        {books.length === 0 && (<div>
            <div className="max-w-lg flex flex-col items-center gap-4 justify-center mx-auto">
                <div>
                    <SearchX className="text-primary size-24"/>
                </div>
                <h3 className="text-3xl font-ibm-plex-sans text-white text-center">Nuk u gjet asnje liber!</h3>
                <p className="text-light-100 text-base font-ibm-plex-sans text-center">Nuk patem mundesi te gjejme ndonje liber ne baze te kerkimit tuaj. Provo ndyshoni tekstin e kerkimit!</p>
                <ResetButton />
            </div>
        </div>)}
    </section>
  )
}

export default page