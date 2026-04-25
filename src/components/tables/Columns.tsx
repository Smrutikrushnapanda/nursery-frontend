"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreVertical } from "lucide-react"
import { useState } from "react"
import { Dropdown } from "@/components/ui/dropdown/Dropdown"
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem"

import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/button"
import { inventoryApis } from "@/utils/api/api"

export type InventoryItem = {
  id: number
  variantId: number
  quantity: number
  updatedAt: string
  variant: {
    id: number
    size: string
    price: number | string
    sku: string
    minQuantity: number | string
    barcode: string | null
    plant: {
      id: number
      name: string
      scientificName?: string | null
    }
  }
}

function getStockStatus(row: InventoryItem): "In Stock" | "Low Stock" | "Out of Stock" {
  const quantity = Number(row.quantity ?? 0)
  const minQuantity = Number(row.variant?.minQuantity ?? 0)

  if (quantity <= 0) {
    return "Out of Stock"
  }

  if (minQuantity > 0 && quantity <= minQuantity) {
    return "Low Stock"
  }

  return "In Stock"
}

function InventoryActions({
  row,
  onView,
  onEdit,
  onDeleted,
  onDeadStock,
}: {
  row: InventoryItem
  onView?: (row: InventoryItem) => void
  onEdit: (row: InventoryItem) => void
  onDeleted: () => void
  onDeadStock: (row: InventoryItem) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsOpen(false)
    const confirmed = window.confirm(
      `Delete stock for "${row.variant?.plant?.name ?? "this item"}" (${row.variant?.sku ?? row.variantId})?`
    )

    if (!confirmed) {
      return
    }

    try {
      await inventoryApis.deleteStock(row.variantId)
      onDeleted()
    } catch (error: any) {
      console.log(error)
      alert(error?.message || "Failed to delete stock")
    }
  }

  return (
    <div className={`relative flex justify-end ${isOpen ? "z-50" : ""}`}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 right-0 top-full">
        <DropdownItem
          onClick={() => {
            onView?.(row)
            setIsOpen(false)
          }}
        >
          View
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            onEdit(row)
            setIsOpen(false)
          }}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            onDeadStock(row)
            setIsOpen(false)
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          Mark as Dead
        </DropdownItem>
        <DropdownItem
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </DropdownItem>
      </Dropdown>
    </div>
  )
}

type InventoryColumnOptions = {
  onView?: (row: InventoryItem) => void
  onEdit: (row: InventoryItem) => void
  onDeleted: () => void
  onDeadStock: (row: InventoryItem) => void
}

export function getInventoryColumns({
  onView,
  onEdit,
  onDeleted,
  onDeadStock,
}: InventoryColumnOptions): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "variant.plant.name",
      header: "Plant",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-gray-800 text-theme-sm">
            {row.original.variant?.plant?.name ?? "-"}
          </p>
          <p className="text-gray-500 text-xs">
            {row.original.variant?.plant?.scientificName ?? row.original.variant?.size ?? "-"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "variant.sku",
      header: "Variant",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-medium text-gray-700 text-theme-sm dark:text-gray-200">
            {row.original.variant?.sku ?? "-"}
          </span>
          <p className="text-gray-500 text-xs">{row.original.variant?.size ?? "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "variant.barcode",
      header: "Barcode",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {row.original.variant?.barcode ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Stock",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="text-gray-700 text-theme-sm dark:text-gray-300">
            {row.original.quantity} units
          </span>
          <p className="text-gray-500 text-xs">
            Min: {Number(row.original.variant?.minQuantity ?? 0)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "variant.price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(row.original.variant?.price ?? 0))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          size="sm"
          color={
            getStockStatus(row.original) === "In Stock"
              ? "success"
              : getStockStatus(row.original) === "Low Stock"
                ? "warning"
                : "error"
          }
        >
          {getStockStatus(row.original)}
        </Badge>
      ),
      sortingFn: (rowA, rowB) => {
        const order = {
          "Out of Stock": 0,
          "Low Stock": 1,
          "In Stock": 2,
        }

        return order[getStockStatus(rowA.original)] - order[getStockStatus(rowB.original)]
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {new Date(row.original.updatedAt).toLocaleDateString("en-IN", {
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
        <InventoryActions
          row={row.original}
          onView={onView}
          onEdit={onEdit}
          onDeleted={onDeleted}
          onDeadStock={onDeadStock}
        />
      ),
    },
  ]
}
