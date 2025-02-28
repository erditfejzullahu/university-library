"use client";
import React, { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { deleteUserQuery, useUsers } from "@/hooks/data-fetch";
import Link from "next/link";
import config from "@/lib/config";
import Image from "next/image";
import { icons } from "@/constants";
import ChangeStatus from "@/components/admin/ChangeStatus";

type User = {
  id: string;
  fullName: string;
  borrowedBooks: { id: string; title: string }[];
  createdAt: string;
  role: string;
  status: string;
  universityId: string;
  universityIdCard: string;
};


const Page = () => {
    const { mutate, isPending } = deleteUserQuery()
    const deleteUser = (userId: string) => {
      console.log("u thirr");
      
      mutate(userId);
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

  const columns: ColumnDef<User>[] = [
    {
      header: "Emri",
      accessorKey: "fullName",
    },
    {
      header: "Librat e huazuar",
      accessorKey: "borrowedBooks",
      cell: (info) => info.getValue(), // Display the count of borrowed books
    },
    {
      header: "I krijuar",
      accessorKey: "createdAt",
    },
    {
      header: "Roli",
      accessorKey: "role",
      cell: (info) => (
        <>
          <span className="block cursor-pointer animate-pulse repeat-infinite duration-700 text-red font-semibold font-bebas-neue text-xl" onClick={() => handleDialogs("Role", info.row.original)}>{info.getValue() as string}</span>
          <ChangeStatus type="Role" selected={info.getValue() as string} selectable={["ADMIN", "USER"]} opened={dialogPopup.roleDialog.includes(info.row.original.id)} onClose={() => handleDialogs("CloseRole", info.row.original)}/>
        </>
      )
    },
    {
      header: "Statusi",
      accessorKey: "status",
      cell: (info) => (
        <>
        <span className="block cursor-pointer animate-pulse repeat-infinite duration-700 text-green font-semibold font-bebas-neue text-xl" onClick={() => handleDialogs("Status", info.row.original)}>{info.getValue() as string}</span>
            <ChangeStatus type="Status" selected={info.getValue() as string} selectable={["IN_REVIEW", "ACCEPTED"]} opened={dialogPopup.statusDialog.includes(info.row.original.id)} onClose={() => handleDialogs("CloseStatus", info.row.original)}/>
        </>
      )
    },
    {
      header: "ID e Universitetit",
      accessorKey: "universityId",
    },
    {
      header: "Karta e Universitetit",
      accessorKey: "universityIdCard",
      cell: (info) => (
        <Link className="text-primary-admin text-sm font-semibold" href={config.env.imagekit.urlEndpoint + info.getValue()} target="_blank">Shiko karten</Link>
      )
    },
    {
        header: "Nderveproni",
        accessorKey: "id",
        cell: (info) => (
            <button disabled={isPending} onClick={() => deleteUser(info.getValue() as string)}><Image className="mx-auto" src={icons.garbage} width={20} height={20} alt="delete"/></button>
        )
    }
  ];

  const table = useReactTable({
    columns,
    data: data?.users || [], // Ensure data is defined
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  <th key={header.id} colSpan={header.colSpan} className="text-light-500 border-b font-semibold text-center p-4 bg-light-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
    </div>
  );
};

export default Page;