"use client"
import { icons } from '@/constants'
import config from '@/lib/config'
import { IKImage } from 'imagekitio-next'
import Image from 'next/image'
import React from 'react'

const BorrowedBooksList = ({bookItem}: {bookItem: BorrowedBook}) => {
    const borrowedDate = new Date(bookItem.borrowedAt)
    const formatBorrowedDate = borrowedDate.toLocaleString("sq-AL", {
        day: "numeric",
        month: "short"
    })

    const returnedDate = new Date(bookItem.returnDate || "");
    const formatReturnedDate = returnedDate.toLocaleDateString("sq-AL", {
        day: "numeric",
        month: "short"
    })

    const dateNow = new Date();
    const countDate = () => {
        const dueDate = new Date(bookItem.dueDate);
        
        const howMuch = (dueDate as any) - (dateNow as any);
        const daysLeft = Math.floor(howMuch / (1000 * 60 * 60 * 24));
        return daysLeft;
    }
    
    
  return (
    <article className="bg-dark-100 self-start items-center justify-center rounded-xl gap-4 relative">
        {(bookItem.status == "RETURNED" && (bookItem.dueDate <= bookItem.returnDate!)) && (<Image src={icons.warning} width={25} height={25} alt='overdue' className="absolute top-0 left-0"/>)}
        <div className="w-full flex-1 flex flex-col gap-3 p-4 rounded-lg !overflow-hidden shadow-[0_0_25px_3px_rgba(0,0,0,0.65)]">
            <div className={`w-full p-4 flex items-center justify-center rounded-lg`} style={{backgroundColor: bookItem.book.coverColor + "B3"}}>
                <div className="shadow-[0_0_25px_3px_rgba(0,0,0,0.65)] rounded-lg">
                    <IKImage path={bookItem.book.coverUrl} urlEndpoint={config.env.imagekit.urlEndpoint} alt={bookItem.book.title} width={160} height={200} className="rounded-lg"/>
                </div>
            </div>

            <div className="mt-2">
                <h3 className="font-ibm-plex-sans font-medium text-white text-xl">{bookItem.book.title}</h3>
                <p className="text-white italic font-ibm-plex-sans text-xs">{bookItem.book.genre}</p>
            </div>

            <div className="flex-row items-center">
                <Image src={icons.book2} width={20} height={20} alt='book' className="float-left mr-1"/>
                <p className="font-ibm-plex-sans text-white text-xs mt-0.5">I marrur me {formatBorrowedDate}</p>
            </div>

            <div>
                {bookItem.status === "RETURNED" && (bookItem.dueDate >= bookItem?.returnDate!) ? (
                    <>
                        <Image src={icons.tick} width={20} height={20} alt='success' className="float-left mr-1" />
                        <p className="font-ibm-plex-sans text-white text-xs mt-0.5">I kthyer me {formatReturnedDate}</p>
                    </>
                ) : bookItem.status === "BORROWED" && (bookItem.dueDate && !bookItem.returnDate) ? (
                    <>
                        <Image src={icons.calendar} width={20} height={20} alt='success' className="float-left mr-1" />
                        <p className="font-ibm-plex-sans text-white text-xs mt-0.5">{countDate()} dite te mbetura</p>
                    </>
                ) : bookItem.status === "RETURNED" && (bookItem.dueDate <= bookItem?.returnDate!) ? (
                    <>
                        <Image src={icons.warning} width={20} height={20} alt='success' className="float-left mr-1" />
                        <p className="font-ibm-plex-sans text-white text-xs mt-0.5">Kthim i vonuar</p>
                    </>
                ) : null}
            </div>
        </div>

    </article>
  )
}

export default BorrowedBooksList