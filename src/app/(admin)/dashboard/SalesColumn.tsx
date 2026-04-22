"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type SalesItem = {
  id: string
  plant: string
  customer: string
  quantity: number
  amount: number
  payment: "UPI" | "Cash" | "Card"
  time: string
}

function getSortIcon(sortState: false | "asc" | "desc") {
  if (sortState === "asc") return <ArrowUp className="size-4" />
  if (sortState === "desc") return <ArrowDown className="size-4" />
  return <ArrowUpDown className="size-4 opacity-60" />
}

function SortableHeader({ title, column }: any) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {getSortIcon(column.getIsSorted())}
    </Button>
  )
}

export const salesColumns: ColumnDef<SalesItem>[] = [
  {
    accessorKey: "plant",
    header: ({ column }) => <SortableHeader title="Plant" column={column} />,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <SortableHeader title="Customer" column={column} />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader title="Qty" column={column} />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <SortableHeader title="Amount" column={column} />,
    cell: ({ row }) => `₹${row.original.amount}`,
  },
  {
    accessorKey: "payment",
    header: ({ column }) => <SortableHeader title="Payment" column={column} />,
  },
  {
    accessorKey: "time",
    header: ({ column }) => <SortableHeader title="Time" column={column} />,
  },
]