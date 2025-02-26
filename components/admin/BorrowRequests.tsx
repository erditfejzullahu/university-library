"use client"
import React, { useState } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link';
import BookListAdmin from './BookListAdmin';
import {Session} from "next-auth"
import { useBooks } from '@/hooks/data-fetch';
import ErrorState from "../ErrorState"

const BorrowRequests = ({session}: {session: Session | null}) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(3)
    const {data, error, isLoading, isFetching} = useBooks(page, pageSize, "BorrowBooks");
    // console.log(error);
    
    if(error) return <ErrorState />
  return (
    <div className="flex-1 flex flex-col gap-4 bg-white rounded-lg p-4">
        <div className="flex flex-row justify-between items-center">
            <div>
                <span className="text-xl  text-dark-100 font-semibold">Kerkesat per huazim libri</span>
            </div>
            <div>
                <Link href={"/admin/all-borrow-requests"} className="bg-light-300 text-primary-admin font-medium text-sm py-1.5 px-4 rounded-lg">Shiko te gjitha</Link>
            </div>
        </div>
        <div className="after:content-[''] after:pointer-events-none after:absolute after:h-full after:w-full after:left-0 after:bottom-0 after:admin-list relative">
            {data?.book.map((item) => (
                <Link href={item.id} key={item.id}>
                    <BookListAdmin type="BorrowBooks" session={session} request={item}/>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default BorrowRequests