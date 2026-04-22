"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"

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

function InventoryActions({
  row,
  onView,
  onEdit,
  onDeleted,
}: {
  row: InventoryItem
  onView?: (row: InventoryItem) => void
  onEdit: (row: InventoryItem) => void
  onDeleted: () => void
}) {
  const handleDelete = async () => {
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
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg"
        onClick={() => onView?.(row)}
        aria-label={`View ${row.variant?.plant?.name ?? "stock item"}`}
      >
          <Eye className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg"
        onClick={() => onEdit(row)}
        aria-label={`Edit ${row.variant?.plant?.name ?? "stock item"}`}
      >
          <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleDelete}
        aria-label={`Delete ${row.variant?.plant?.name ?? "stock item"}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

type InventoryColumnOptions = {
  onView?: (row: InventoryItem) => void
  onEdit: (row: InventoryItem) => void
  onDeleted: () => void
}

export function getInventoryColumns({
  onView,
  onEdit,
  onDeleted,
}: InventoryColumnOptions): ColumnDef<InventoryItem>[] {
return [
  {
    accessorKey: "variant.plant.name",
    header: ({ column }) => (
      <SortableHeader title="Plant" column={column} />
    ),
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
    header: ({ column }) => <SortableHeader title="Variant" column={column} />,
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
    header: ({ column }) => <SortableHeader title="Barcode" column={column} />,
    cell: ({ row }) => (
      <span className="text-gray-500 text-theme-sm dark:text-gray-400">
        {row.original.variant?.barcode ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader title="Stock" column={column} />,
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
    header: ({ column }) => <SortableHeader title="Price" column={column} />,
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
    header: ({ column }) => <SortableHeader title="Status" column={column} />,
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
    header: ({ column }) => <SortableHeader title="Updated" column={column} />,
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
      />
    ),
  },
]
}
