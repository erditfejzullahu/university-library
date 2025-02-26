"use client";
import React, { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useUsers } from "@/hooks/data-fetch";
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

const deleteUser = (userId: string) => {
    console.log(userId);
    
}

const Page = () => {
    
    const [dialogPopup, setDialogPopup] = useState({
        statusDialog: false,
        roleDialog: false,
    })

    const handleDialogs = (type: "Status" | "Role" | "CloseStatus" | "CloseRole") => {
        if(type === "Role"){
            setDialogPopup((prev) => ({
                ...prev,
                roleDialog: !prev.roleDialog
            }))
        }else if(type === "Status"){
            setDialogPopup((prev) => ({
                ...prev,
                statusDialog: !prev.statusDialog
            }))
        }else if(type === "CloseRole"){
            setDialogPopup((prev) => ({
                ...prev,
                roleDialog: false
            }))
        }else if(type ==="CloseStatus"){
            console.log("po thirret?");
            
            setDialogPopup((prev) => ({
                ...prev,
                statusDialog: false
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
    },
    {
      header: "Statusi",
      accessorKey: "status",
      cell: (info) => (
        <>
        <span className="block cursor-pointer" onClick={() => handleDialogs("Status")}>{info.getValue() as string}</span>
            <ChangeStatus type="Status" selected={info.getValue() as string} selectable={["IN_REVIEW", "ACCEPTED"]} opened={dialogPopup.statusDialog} onClose={() => handleDialogs("CloseStatus")}/>
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
            <Image className="mx-auto cursor-pointer" src={icons.garbage} width={20} height={20} alt="delete" onClick={() => deleteUser(info.getValue() as string)}/>
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
                  <th key={header.id} colSpan={header.colSpan} className="text-light-500 font-semibold text-center p-4 bg-light-300">
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
              <tr key={row.id}>
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
  );
};

export default Page;