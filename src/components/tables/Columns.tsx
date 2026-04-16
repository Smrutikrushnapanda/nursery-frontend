"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/button"

export type InventoryItem = {
  id: string
  name: string
  sku: string
  species: string
  location: string
  stock: number
  price: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

function getSortIcon(sortState: false | "asc" | "desc") {
  if (sortState === "asc") {
    return <ArrowUp className="size-4" />
  }

  if (sortState === "desc") {
    return <ArrowDown className="size-4" />
  }

  return <ArrowUpDown className="size-4 opacity-60" />
}

function SortableHeader({
  title,
  column,
}: {
  title: string
  column: {
    getIsSorted: () => false | "asc" | "desc"
    toggleSorting: (desc?: boolean) => void
  }
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {getSortIcon(column.getIsSorted())}
    </Button>
  )
}

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader title="Plant" column={column} />
    ),
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortableHeader title="SKU" column={column} />,
    cell: ({ row }) => (
      <span className="font-medium text-gray-700 text-theme-sm dark:text-gray-200">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <SortableHeader title="Location" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-gray-500 text-theme-sm dark:text-gray-400">
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => <SortableHeader title="Stock" column={column} />,
    cell: ({ row }) => (
      <span className="text-gray-500 text-theme-sm dark:text-gray-400">
        {row.original.stock} units
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader title="Price" column={column} />,
    cell: ({ row }) => (
      <span className="text-gray-500 text-theme-sm dark:text-gray-400">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.original.price)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader title="Status" column={column} />,
    cell: ({ row }) => (
      <Badge
        size="sm"
        color={
          row.original.status === "In Stock"
            ? "success"
            : row.original.status === "Low Stock"
              ? "warning"
              : "error"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
]
