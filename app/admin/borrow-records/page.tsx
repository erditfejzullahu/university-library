"use client"
import { fetchBooks } from '@/hooks/data-fetch'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import Image from 'next/image'
import config from '@/lib/config'
import { icons } from '@/constants'
import { cn } from '@/lib/utils'
import ErrorState from '@/components/ErrorState'
import { ChevronDown, ChevronUp } from 'lucide-react'

const page = () => {
    const fetchBorrowedBooks = async () => await fetchBooks<"BorrowBooks">(0, 0, "BorrowBooks")
    
    const {data, error, isLoading, isFetching} = useQuery({
        queryKey: ["borrowedBooks"],
        queryFn: fetchBorrowedBooks,
        staleTime: 1000 * 60 * 5, //5 mins
        refetchOnMount: false,
        refetchOnWindowFocus: false
    })

    const handleRecipeGeneration = (row: BorrowedBook) => {
        console.log(row);
    }

    const [sorting, setSorting] = useState<SortingState>([])

    const columns: ColumnDef<BorrowedBook>[] = [
        {
            header: "Libri",
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <img src={config.env.imagekit.urlEndpoint + info.row.original.book.coverUrl} className="h-20 object-fit"/>
                    <p>{info.row.original.book.title}</p>
                </div>
            ),
            enableSorting: true
        },
        {
            header: "Perdoruesi",
            cell: (info) => (
                <div className="flex flex-row items-center gap-2">
                    <div>
                        <img src={icons.verifiedIcon} className="size-14 rounded-full"/>
                    </div>
                    <div>
                        <p className="text-black text-base font-semibold text-left">{info.row.original.user?.fullName}</p>
                        <p className="text-gray-400 text-sm font-light text-left">{info.row.original.user?.email}</p>
                    </div>
                </div>
            ),
            enableSorting: true
        },
        {
            header: "Statusi i huazimit",
            cell: (info) => {
                const data = info.row.original;
                return (
                    <div className="flex items-center justify-center">
                        <button className={cn("flex w-fit font-semibold text-base rounded-xl px-4 py-1",
                            data.status === "RETURNED" && (data.dueDate <= data.returnDate!)
                            ? "bg-red-200 text-red"
                            : data.status === "BORROWED" 
                            ? "bg-violet-200 text-violet-900"
                            : data.status === "RETURNED" && (data.dueDate >= data.returnDate!)
                            ? "bg-blue-200 text-blue-100"
                            : null
                        )}>
                            {data.status === "RETURNED" && (data.dueDate <= data.returnDate!)
                            ? "Kthim i vone"
                            : data.status === "BORROWED" 
                            ? "Huazuar"
                            : data.status === "RETURNED" && (data.dueDate >= data.returnDate!)
                            ? "I kthyer"
                            : null}
                        </button>
                    </div>
                )
            },
            enableSorting: true,
        },
        {
            header: "Data e huazimit",
            cell: (info) => {
                const date = new Date(info.row.original.borrowedAt)
                const formattedDate = date.toLocaleDateString("sq-AL", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                })
                return formattedDate
            },
            enableSorting: true
        },
        {
            header: "Data e kthimit",
            cell: (info) => {
                const date = new Date(info.row.original.returnDate || "")
                if(isNaN(date.getTime())) return "N/A"

                const formattedDate = date.toLocaleDateString("sq-AL", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                })
                return formattedDate
            },
            enableSorting: true
        },
        {
            header: "Detyrimi i kthimit",
            cell: (info) => {
                const date = new Date(info.row.original.dueDate)

                const formattedDate = date.toLocaleDateString("sq-AL", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                })
                return formattedDate
            },
            enableSorting: true
        },
        {
            header: "Recepta",
            cell: (info) => {
                <button className="flex flex-row gap-2" onClick={() => handleRecipeGeneration(info.row.original)}>
                    <Image src={icons.receipt} width={10} height={10} alt='receipt'/>
                    <p>Gjenero</p>
                </button>
            }
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
                pageSize:5
            }
        }
    })

    if(isLoading || isFetching) return <div>Loading...</div>
    if(error) return <div><ErrorState /></div>

    return (
    <section className="rounded-lg bg-white p-4">
        <div>
            <h2 className="text-xl font-semibold">Te gjithe kerkesat per huazim</h2>
        </div>
        <div className="mt-7">
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
                                    <td
                                        key={cell.id}
                                        className="p-4 text-center text-black font-normal font-ibm-plex-sans text-sm relative"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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