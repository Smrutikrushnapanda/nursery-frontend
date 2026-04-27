"use client"

import { ColumnDef } from "@tanstack/react-table"

export type SalesItem = {
  id: string
  plant: string
  customer: string
  quantity: number
  amount: number
  payment: "UPI" | "Cash" | "Card"
  time: string
}

export const salesColumns: ColumnDef<SalesItem>[] = [
  {
    id: "slNo",
    header: "Sl No",
    cell: ({ row }) => (
      <span className="text-gray-500 font-medium">{row.index + 1}</span>
    ),
    size: 50,
  },
  {
    accessorKey: "plant",
    header: "Plant",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount}`,
  },
  {
    accessorKey: "payment",
    header: "Payment",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
]