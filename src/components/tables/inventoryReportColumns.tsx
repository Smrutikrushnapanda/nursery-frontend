"use client"

import { ColumnDef } from "@tanstack/react-table"

export type InventoryItemData = {
  plantId: number
  plantName: string
  variantId: number
  size: string
  sku: string
  unitPrice: number
  stockQty: number
  stockValue: number
}

export function getInventoryReportColumns(): ColumnDef<InventoryItemData>[] {
  return [
    {
      accessorKey: "plantName",
      header: "Plant Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-white font-semibold">
            {row.original.plantName}
          </span>
          <span className="text-xs text-gray-500 font-mono">{row.original.sku}</span>
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          {row.original.size}
        </span>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          ₹ {row.original.unitPrice.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      accessorKey: "stockQty",
      header: "Stock Quantity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
            row.original.stockQty > 10 
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}>
            {row.original.stockQty}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => (
        <div className="font-bold text-brand-600 dark:text-brand-400">
          ₹ {row.original.stockValue.toLocaleString("en-IN")}
        </div>
      ),
    },
  ]
}
