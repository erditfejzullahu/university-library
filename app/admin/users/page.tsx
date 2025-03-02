"use client";
import React, { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useDeleteUserQuery, useUsers } from "@/hooks/data-fetch";
import Link from "next/link";
import config from "@/lib/config";
import Image from "next/image";
import { icons } from "@/constants";
import ChangeStatus from "@/components/admin/ChangeStatus";
import { ChevronDown, ChevronUp } from "lucide-react";

// type User = {
//   id: string;
//   fullName: string;
//   borrowedBooks: { id: string; title: string }[];
//   createdAt: string;
//   role: string;
//   status: string;
//   universityId: string;
//   universityIdCard: string;
// };


const Page = () => {
    const { mutate: deleteUser, isPending } = useDeleteUserQuery()
    const handleDelete = (userId: string) => {
      console.log("u thirr");
      
      deleteUser({id: userId});
    }
  
    const [dialogPopup, setDialogPopup] = useState({
        statusDialog: [] as string[],
        roleDialog: [] as string[],
    })

    const handleDialogs = (type: "Status" | "Role" | "CloseStatus" | "CloseRole", row: User) => {
      console.log(row);
      
        if(type === "Role"){
          setDialogPopup((prev) => ({
            ...prev,
            roleDialog: row ? [...prev.roleDialog, row.id] : prev.roleDialog
          }))
        }else if(type === "Status"){
            setDialogPopup((prev) => ({
              ...prev,
              statusDialog: row ? [...prev.statusDialog, row.id] : prev.statusDialog
            }))
        }else if(type === "CloseRole"){
            setDialogPopup((prev) => ({
              ...prev,
              roleDialog: []
            }))
        }else if(type ==="CloseStatus"){            
            setDialogPopup((prev) => ({
              ...prev,
              statusDialog: []
            }))
        }
    }


  const { data, error, isLoading, isFetching } = useUsers();  

  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<User>[] = [
    {
      header: "Emri",
      accessorKey: "fullName",
      enableSorting: true,
    },
    {
      header: "Librat e huazuar",
      accessorKey: "borrowedBooks",
      cell: (info) => info.getValue(), // Display the count of borrowed books
      enableSorting: true,
    },
    {
      header: "I krijuar",
      accessorKey: "createdAt",
      enableSorting: true,
    },
    {
      header: "Roli",
      accessorKey: "role",
      cell: (info) => (
        <>
          <span className="block cursor-pointer animate-pulse repeat-infinite duration-700 text-red font-semibold font-bebas-neue text-xl" onClick={() => handleDialogs("Role", info.row.original)}>{info.getValue() as string}</span>
          <ChangeStatus data={info.row.original as User} type="Role" selected={info.getValue() as string} selectable={["ADMIN", "USER"]} opened={dialogPopup.roleDialog.includes(info.row.original.id)} onClose={() => handleDialogs("CloseRole", info.row.original)}/>
        </>
      ),
      enableSorting: true,
    },
    {
      header: "Statusi",
      accessorKey: "status",
      cell: (info) => (
        <>
        <span className="block cursor-pointer animate-pulse repeat-infinite duration-700 text-green font-semibold font-bebas-neue text-xl" onClick={() => handleDialogs("Status", info.row.original)}>{info.getValue() as string}</span>
            <ChangeStatus data={info.row.original} type="Status" selected={info.getValue() as string} selectable={["IN_REVIEW", "ACCEPTED"]} opened={dialogPopup.statusDialog.includes(info.row.original.id)} onClose={() => handleDialogs("CloseStatus", info.row.original)}/>
        </>
      ),
      enableSorting: true,
    },
    {
      header: "ID e Universitetit",
      accessorKey: "universityId",
      enableSorting: true,
    },
    {
      header: "Karta e Universitetit",
      accessorKey: "universityIdCard",
      cell: (info) => (
        <Link className="text-primary-admin text-sm font-semibold" href={config.env.imagekit.urlEndpoint + info.getValue()} target="_blank">Shiko karten</Link>
      ),
      enableSorting: false,
    },
    {
        header: "Nderveproni",
        accessorKey: "id",
        cell: (info) => (
            <button disabled={isPending} onClick={() => handleDelete(info.getValue() as string)}><Image className="mx-auto" src={icons.garbage} width={20} height={20} alt="delete"/></button>
        ),
        enableSorting: false,
    }
  ];

  const table = useReactTable({
    columns,
    data: data?.users || [], // Ensure data is defined
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
  });

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="rounded-lg bg-white p-4">
      <div>
        <h2 className="text-2xl font-semibold text-black">Te gjithe perdoruesit</h2>
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
                    <div className="flex flex-row items-center gap-2 justify-center">
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                        )}
                      </div>
                      <div>
                        {
                          {
                            asc: <ChevronUp />,
                            desc: <ChevronDown />
                          }[header.column.getIsSorted() as string ?? null]
                        }
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
                  <td key={cell.id} className="p-4 text-center text-black font-normal font-ibm-plex-sans text-sm relative ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination  */}
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
  );
};

export default Page;