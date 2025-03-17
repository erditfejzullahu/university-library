"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { bookSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import {useForm} from "react-hook-form"
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import ColorPicker from '../ColorPicker';
import { createBook, editBook } from '@/lib/admin/actions/book';
import { toast } from '@/hooks/use-toast';

interface Props extends Partial<Book> {
    type?: "create" | "update",

}

const BookForm = ({type, ...book}: Props) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: book.title || "",
            description: book.description || "",
            author: book.author || "",
            genre: book.genre || "",
            rating: book.rating || 1,
            totalCopies: book.totalCopies || 1,
            availableCopies: book.availableCopies || 1,
            coverUrl: book.coverUrl || "",
            coverColor: book.coverColor || "",
            videoUrl: book.videoUrl || "",
            summary: book.summary || ""
        }
    })

    // useEffect(() => {
    //     if(book){
    //         form.reset({
    //             title: book.title || "",
    //             description: book.description || "",
    //             author: book.author || "",
    //             genre: book.genre || "",
    //             rating: book.rating || 1,
    //             totalCopies: book.totalCopies || 1,
    //             availableCopies: book.availableCopies || 1,
    //             coverUrl: book.coverUrl || "",
    //             coverColor: book.coverColor || "",
    //             videoUrl: book.video || "",
    //             summary: book.summary || ""
    //         }); 
    //     }
    // }, [book]);

    const onSubmit = async(values: z.infer<typeof bookSchema>) => {
        if(type === "create"){
            const result = await createBook(values);
            if(result.success){
                toast({
                    title: "Sukses",
                    description: "Libri u shtua me sukses"
                })
    
                router.push(`/admin/books/${result.data?.id}`)
                scrollTo({top: 0, behavior: "smooth"})
            }else{
                toast({
                    title: "Dicka shkoi gabim",
                    description: `${result.message}`,
                    variant:"destructive"
                })
            }
        }else {
            const result = await editBook(values);
            if(result.success){
                toast({
                    title: "Sukses",
                    description: "Libri u perditesua me sukses"
                })
                scrollTo({top: 0, behavior: "smooth"})
            }else{
                toast({
                    title: "Dicka shkoi gabim",
                    description: `${result.message}`,
                    variant: "destructive"
                })
            }
        }
    };
    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name='title'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Titulli Librit
                        </FormLabel>
                        <FormControl>
                            <Input 
                                required
                                placeholder='Shkruani ketu titullin e librit'
                                {...field}
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <FormField
                control={form.control}
                name='author'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Emri i autorit
                        </FormLabel>
                        <FormControl>
                            <Input 
                                required
                                placeholder='Shkruani ketu emrin e autorit'
                                {...field}
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <FormField
                control={form.control}
                name='genre'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Zhanri i librit
                        </FormLabel>
                        <FormControl>
                            <Input 
                                required
                                placeholder='Shkruani ketu zhanrin e librit'
                                {...field}
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <FormField 
                control={form.control}
                name="rating"
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Vleresimi i librit
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type='number'
                                required
                                placeholder='Paraqitni vleresimin e librit ketu'
                                {...field}
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}    
            >
            </FormField>
            <FormField
                control={form.control}
                name='totalCopies'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base text-dark-500 font-normal">
                            Numri i kopjeve te librit
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type='number'
                                {...field}
                                min={1}
                                max={10000}
                                required
                                placeholder='Paraqitni ketu numrin e kopjeve te librit'
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <FormField
                control={form.control}
                name='availableCopies'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base text-dark-500 font-normal">
                            Kopjet ne dispozicion
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type='number'
                                {...field}
                                min={1}
                                max={10000}
                                required
                                placeholder='Paraqitni numrin e kopjeve ne dispozicion'
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>

            <FormField
                control={form.control}
                name='coverColor'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base text-dark-500 font-normal">
                            Ngjyra e librit
                        </FormLabel>
                        <FormControl>
                            <ColorPicker onPickerChange={field.onChange} value={field.value}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <FormField
                control={form.control}
                name='coverUrl'
                render={({field}) => (
                    <FormItem className='flex flex-col gap-1'>
                        <FormLabel className="text-base text-dark-500 font-normal">
                            Imazhi i librit
                        </FormLabel>
                        <FormControl>
                            <FileUpload 
                                type="image"
                                accept='image/*'
                                placeholder='Ngarko nje imazh te librit'
                                folder='books/covers'
                                variant='light'
                                onFileChange={field.onChange}
                                value={field.value} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >

            </FormField>

            <FormField 
                control={form.control}
                name='description'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Shkruani pershkrimin
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                required
                                placeholder='Pershkruani librin ketu'
                                className="book-form_input"
                                rows={10}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name='videoUrl'
                render={({field}) => (
                    <FormItem className='flex flex-col gap-1'>
                        <FormLabel className="text-base font-normal">
                            Videoja e librit
                        </FormLabel>
                        <FormControl>
                            <FileUpload 
                                type='video'
                                accept='video/*'
                                placeholder='Ngarko nje video te librit'
                                folder='books/videos'
                                variant='light'
                                onFileChange={field.onChange}
                                value={field.value}
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >

            </FormField>
            <FormField
                control={form.control}
                name='summary'
                render={({field}) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                            Shkruani permbledhjen
                        </FormLabel>
                        <FormControl>
                            <Textarea 
                                {...field}
                                placeholder='Shkruani ketu permbledhjen e librit'
                                required
                                className="book-form_input"
                                rows={20}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            >
            </FormField>
            <Button type='submit' className="book-form_btn">{type === "create" ? "Shtoni librin ne librari" : "Rifreskoni librin"}</Button>
        </form>
    </Form>
  )
}

export default BookForm