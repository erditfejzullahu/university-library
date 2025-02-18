import { bookSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import React from 'react'
import {Form, useForm} from "react-hook-form"
import { z } from 'zod';

interface Props extends Partial<Book> {
    type?: "create" | "update",

}

const BookForm = ({type, ...book}: Props) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: ""
        }
    })

    const onSubmit = async(values: z.infer<typeof bookSchema>) => {};
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        </form>
    </Form>
  )
}

export default BookForm