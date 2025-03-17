import React from 'react'
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BookForm from '@/components/admin/forms/BookForm';

const page = async ({params}: {params: {bookId: string}}) => {
    const {bookId} = await params;
    const book = await prisma.books.findUnique({
      where: {id: bookId}
    })
    if(!book) return notFound();
  return (
    <div className="rounded-2xl w-full p-7 bg-white">
      <Button asChild className="back-btn">
        <Link href='/admin/books'>Kthehu mbrapa</Link>
      </Button>

      <BookForm type='update' {...book}/>
    </div>
  )
}

export default page