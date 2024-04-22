"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Image } from "./types"

export const columns: ColumnDef<Image>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    {
      accessorKey: "original_base64",
      header: "Origin Image",
    },
  ]