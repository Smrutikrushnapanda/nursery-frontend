"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge/Badge"

export type PaymentItem = {
  id: number;
  orderId: number;
  organizationId: string;
  method: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  amount: number;
  referenceNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getPaymentColumns({
  onView,
}: {
  onView?: (row: PaymentItem) => void
}): ColumnDef<PaymentItem>[] {
  return [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => (
        <span className="text-gray-500 font-medium">{row.index + 1}</span>
      ),
      size: 50,
    },
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => <span className="text-gray-500 font-medium text-theme-sm">#{row.original.id}</span>,
    },
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300 font-medium text-theme-sm">#{row.original.orderId}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-gray-900 dark:text-white text-theme-sm">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(Number(row.original.amount))}
        </span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => (
        <span className="text-gray-600 dark:text-gray-400 text-theme-sm">
          {row.original.method.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          size="sm"
          color={
            row.original.status === "COMPLETED" ? "success" : 
            row.original.status === "PENDING" ? "warning" : "error"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm">
          {new Date(row.original.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-lg"
            onClick={() => onView?.(row.original)}
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      ),
    },
  ]
}
