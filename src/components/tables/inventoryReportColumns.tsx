"use client"

import { ColumnDef } from "@tanstack/react-table"
import Badge from "@/components/ui/badge/Badge";

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
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => (
        <span className="text-gray-500 font-medium">{row.index + 1}</span>
      ),
      size: 50,
    },
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
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.original.unitPrice)}
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
              : row.original.stockQty > 0
                ? "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400 border border-warning-200 dark:border-warning-800"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}>
            {row.original.stockQty}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const qty = row.original.stockQty;
        const status = qty > 10 ? "In Stock" : qty > 0 ? "Low Stock" : "Out of Stock";
        const colors = {
          "In Stock": "success",
          "Low Stock": "warning",
          "Out of Stock": "error"
        } as const;

        return (
          <Badge color={colors[status]} size="sm">
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => (
        <div className="font-bold text-brand-600 dark:text-brand-400">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.original.stockValue)}
        </div>
      ),
    },
  ]
}
