"use client"
import ErrorState from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { icons } from '@/constants'
import { deleteUser, fetchUsersPending, updateUser, useDeleteUserQuery, useUsers } from '@/hooks/data-fetch'
import { toast } from '@/hooks/use-toast'
import config from '@/lib/config'
import { StatusErrors } from '@/utils/ErrorTypes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const page = () => {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([])

    const {data, isFetching, isLoading, error, isError} = useQuery({
        queryKey: ["usersRequests"],
        queryFn: fetchUsersPending,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const {mutate, isError: mutationError, isPending: mutationLoading} = useMutation({
        mutationFn: ({id}: {id: string}) => deleteUser(id),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(["usersRequests"], (oldData: UserApiResponse | undefined) => {
                if(!oldData) return oldData;

                if(oldData.users.length === 1){
                    queryClient.invalidateQueries({
                        queryKey: ['usersRequests']
                    })
                }

                return {
                    ...oldData,
                    users: oldData.users.filter((user) => user.id !== variables.id)
                }
            })
            toast({
                title: "Sukses",
                description: "Perdoruesi u largua me sukses!"
            })
        },
        onError: () => {
            toast({
                title: "Gabim",
                description: "Dicka shkoi gabim, ju lutem provoni perseri",
                variant: "destructive"
            })
        }
    })

    const {mutate: approveMutate, isError: approveError, isPending: approvePending} = useMutation({
        mutationFn: ({id, data}: {id: string, data: User}) => updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(["usersRequests"], (oldData: UserApiResponse | undefined) => {
                if(!oldData) return oldData;
                if(oldData.users.length === 1){
                    queryClient.invalidateQueries({
                        queryKey: ["usersRequests"]
                    })
                }
                return {
                    ...oldData,
                    users: oldData.users.map((user) => 
                        user.id === variables.id
                            ? {...user, status: variables.data.status}
                            : user)
                }
            })

            toast({
                title: "Sukses",
                description: "Perdoruesi u aprovua"
            })
        },
        onError: () => {
            toast({
                title: "Gabim",
                description: "Dicka shkoi gabim, ju lutem provoni perseri",
                variant: "destructive"
            })
        }
    })

    const handleApprove = (id: string, data: User) => {
        approveMutate({id, data})
    }

    const handleRemove = (id: string) => {
        mutate({id})
    }

    const columns: ColumnDef<User>[] = [
        {
            header: "Emri",
            cell: (info) => (
                <div className="flex flex-row items-center justify-center gap-2">
                    <div>
                        <img className="size-16" src={config.env.apiEndpoint + info.row.original.profileImage} alt={`profile-${info.row.original.fullName}`}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{info.row.original.fullName}</h2>
                        <p className="text-gray-400">{info.row.original.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Data e krijimit",
            cell: (info) => {
                const date = new Date(info.row.original.createdAt)
                const formattedDate = date.toLocaleDateString("sq-AL", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                })
                return formattedDate
            }
        },
        {
            header: "ID Universitetit",
            accessorKey: "universityId"
        },
        {
            header: "Karta e universitetit",
            cell: (info) => {

                return(
                    <Link target='_blank' href={config.env.imagekit.urlEndpoint + info.row.original.universityIdCard} className="flex flex-row justify-center items-center gap-2">
                        <div>
                            <Image src={icons.eye} alt='eye'/>
                        </div>
                        <div>
                            <p>Shiko karten</p>
                        </div>
                    </Link>
                )
            }
        },
        {
            header: "Aksione",
            cell: (info) => {
                return (
                    <div className="flex flex-row gap-4 justify-center items-center">
                            <Button onClick={() => handleApprove(info.row.original.id, info.row.original)} disabled={approvePending} className="bg-green-100 text-green">Aprovo llogarine</Button>
                        <Button disabled={mutationLoading} className="" onClick={() => handleRemove(info.row.original.id)}>
                            <Image src={icons.close} alt='close'/>
                        </Button>
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({
        columns,
        data: data?.users || [],
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

if(isFetching || isLoading) return <p>Loading...</p>
if(error?.message === StatusErrors[1] || data?.users?.length === 0){
    return <div>No user found...</div>
}else if(error?.message === StatusErrors[2]){
    return <div className="p-4"><ErrorState /></div>
}
  return (
    <section className="w-full rounded-2xl bg-white p-7">
        <h2 className="text-xl font-semibold">Kerkesat per regjistrim</h2>

        <div className="mt-7 w-full overflow-hidden">
            <div className="mb-2">
                <p className="text-black text-sm">Numerimi i te gjithe kerkesave: {data?.users?.length}</p>
            </div>
            <div>
                <table className="border-spacing-2 border w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className="text-light-500 border-b font-semibold text-center p-4 bg-light-300 border cursor-pointer"
                                    >
                                        <div className="flex flex-row items-center gap-2 justify-center">
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
        </div>
    </section>
  )
}

export default page