"use client"

import { ColumnDef } from "@tanstack/react-table"

export type SalesData = {
  period: string
  orderCount: number
  revenue: number
}

export function getSalesReportColumns(): ColumnDef<SalesData>[] {
  return [
    {
      accessorKey: "period",
      header: "Period / Date",
      cell: ({ row }) => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {new Date(row.original.period).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "orderCount",
      header: "Total Orders",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {row.original.orderCount}
          </span>
          <span className="text-gray-500 text-xs">orders</span>
        </div>
      ),
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="font-bold text-brand-600 dark:text-brand-400">
          ₹ {row.original.revenue.toLocaleString("en-IN")}
        </div>
      ),
    },
  ]
}
