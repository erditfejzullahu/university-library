"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { borrowBook } from '@/lib/actions/borrowBook'

interface Props {
    userId: string,
    bookId: string,
    borrowEligbility: {
        isEligible: boolean,
        message: string,
    }
};

const BorrowButton = ({userId, bookId, borrowEligbility}: Props) => {
    const router = useRouter();
    const [borrowing, setBorrowing] = useState(false)

    const handleBorrow = async () => {
        if(!borrowEligbility.isEligible){
            toast({
                title: "Gabim",
                description: borrowEligbility.message,
                variant: "destructive"
            })
        }

        setBorrowing(true)

        try {
            const result = await borrowBook({bookId, userId})
            if(result.success){
                toast({
                    title: "Sukses",
                    description: borrowEligbility.message
                })

                router.push('/my-profile')
            }else{
                toast({
                    title: "Gabim!",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Dicka shkoi gabim",
                description: "Dicka shkoi gabim ne huazimin e librit!",
                variant: "destructive"
            })
        } finally {
            setBorrowing(false)
        }
    }
  return (
    <Button className="book-overview_btn" disabled={borrowing} onClick={handleBorrow}>
        <Image src={"/icons/book.svg"} alt='book' width={20} height={20}/>
        <p className="font-bebas-neue text-xl text-dark-100">{borrowing ? "Duke huazuar": "Huazoni"}</p>
    </Button>
  )
}

export default BorrowButton