"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Image } from "./types"
import Link from "next/link"

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return (
        <Link 
          href={`/images/${id}`} 
          className="text-white hover:text-zinc-300 hover:underline font-medium"
        >
          {id.substring(0, 8)}...
        </Link>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at") as string
      // Format the date
      const date = new Date(timestamp)
      return (
        <span>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      )
    },
  },
  {
    accessorKey: "original_base64",
    header: "Image Preview",
    cell: ({ row }) => {
      const base64 = row.getValue("original_base64") as string
      const id = row.getValue("id") as string
      
      return (
        <Link href={`/images/${id}`}>
          <div className="w-20 h-20 overflow-hidden rounded border border-zinc-700">
            <img 
              src={base64} 
              alt="Preview" 
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
      )
    },
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      
      return (
        <Link 
          href={`/images/${id}`}
          className="px-3 py-1 bg-white text-black text-sm rounded hover:bg-zinc-200"
        >
          View
        </Link>
      )
    },
  },
]