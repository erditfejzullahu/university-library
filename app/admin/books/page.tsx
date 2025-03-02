"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import Image from 'next/image'
import config from '@/lib/config'
import { icons } from '@/constants'
import { fetchBooks, useBooks } from '@/hooks/data-fetch'
import ErrorState from '@/components/ErrorState'
import { useQuery } from '@tanstack/react-query'

const page = () => {

  const fetchBooksStable = async () => await fetchBooks<"Books">(0, 0, "Books")

  const {data, error, isFetching, isLoading} = useQuery({
    queryKey: ["allbooks"],
    queryFn: fetchBooksStable,
    staleTime: 1000 * 60 * 5, //5 mins,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })

  const columns: ColumnDef<Book>[] = [
    {
      header: "Titulli librit",
      accessorKey: "title",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <img src={config.env.imagekit.urlEndpoint + info.row.original.coverUrl} className="h-20 object-contain"/>
          <p>{info.getValue() as string}</p>
        </div>  
      )
    },
    {
      header: "Autori",
      accessorKey: "author"
    },
    {
      header: "Zhanri",
      accessorKey: "genre"
    },
    {
      header: "Data e krijimit",
      accessorKey: "createdAt",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        const formattedDate = date.toLocaleDateString("sq-AL", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        })
        return (
          formattedDate
        )
      }
    },
    {
      header: "Aksione",
      cell: (info) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <div>
            <Image src={icons.edit} width={20} height={20} alt='edit'/>
          </div>
          <div>
            <Image src={icons.garbage} width={20} height={20} alt='delete'/>
          </div>
        </div>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: data?.book || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  })

  if(isLoading || isFetching) return <div>Loading...</div>
  if(error) return <div><ErrorState /></div>

  return (
    <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Te gjithe librat</h2>
            <Button className="bg-primary-admin" asChild>
                <Link href={"/admin/books/new"} className="text-white">+ Krijo nje liber te ri</Link>
            </Button>
        </div>

        <div className="mt-7 w-full overflow-hidden">
          <div>
            <p className="text-black text-sm">Numerimi i te gjithe librave: {data?.totalPages}</p>
          </div>
          <div className="mt-2">
            <table className="border-spacing-2 border w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan} className="text-light-500 border-b font-semibold text-center p-4 bg-light-300">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        }
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="odd:bg-light-400">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 text-center text-black font-normal font-ibm-plex-sans text-sm relative">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </section>
  )
}

export default page