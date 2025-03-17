"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import Image from 'next/image'
import config from '@/lib/config'
import { icons } from '@/constants'
import { fetchBooks, useBooks } from '@/hooks/data-fetch'
import ErrorState from '@/components/ErrorState'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp } from 'lucide-react'

const page = () => {

  const fetchBooksStable = async () => await fetchBooks<"Books">(0, 0, "Books")

  const {data, error, isFetching, isLoading} = useQuery({
    queryKey: ["allbooks"],
    queryFn: fetchBooksStable,
    staleTime: 1000 * 60 * 5, //5 mins,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Book>[] = [
    {
      header: "Titulli librit",
      accessorKey: "title",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <img src={config.env.imagekit.urlEndpoint + info.row.original.coverUrl} className="h-20 object-contain"/>
          <p>{info.getValue() as string}</p>
        </div>  
      ),
      enableSorting: true
    },
    {
      header: "Autori",
      accessorKey: "author",
      enableSorting: true
    },
    {
      header: "Zhanri",
      accessorKey: "genre",
      enableSorting: true
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
      },
      enableSorting: true
    },
    {
      header: "Aksione",
      cell: (info) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <div>
            <Link href={`/admin/books/edit/${info.row.original.id}`}>
              <Image src={icons.edit} width={20} height={20} alt='edit'/>
            </Link>
          </div>
          <div>
            <Image src={icons.garbage} width={20} height={20} alt='delete'/>
          </div>
        </div>
      ),
      enableSorting: false
    }
  ]

  const table = useReactTable({
    columns,
    data: data?.book || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    },
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
                      <th 
                        key={header.id}
                        colSpan={header.colSpan} 
                        className="text-light-500 border-b font-semibold text-center p-4 bg-light-300 border cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className={`flex flex-row items-center gap-2 justify-center`}>
                            <div>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                              }
                            </div>
                            <div>
                              {{
                                asc: <ChevronUp />,
                                desc: <ChevronDown />
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
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

          {/* pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 bg-primary-admin text-white rounded disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Mbrapa
              </button>
              <button 
                className="px-4 py-2 bg-primary-admin text-white rounded disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Tjetra
              </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700"> 
                  Faqja {table.getState().pagination.pageIndex + 1} nga {table.getPageCount()}
                </span>
                <select
                  className="px-2 py-1 border rounded cursor-pointer"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option className="cursor-pointer" key={pageSize} value={pageSize}>Shfaq {pageSize}</option>
                  ))}
                </select>
            </div>
          </div>
        </div>
    </section>
  )
}

export default page