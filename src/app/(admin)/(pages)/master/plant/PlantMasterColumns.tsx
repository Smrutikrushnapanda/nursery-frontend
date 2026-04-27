"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { PlantMasterRow } from "./PlantMasterData";

function PlantActions({
  row,
  onEdit,
  onDelete,
}: {
  row: PlantMasterRow;
  onEdit: (plant: PlantMasterRow) => void;
  onDelete: (plant: PlantMasterRow) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="icon" variant="outline" className="h-8 w-8 rounded-lg">
        <Link href={`/plant/${row.id}`} aria-label={`View ${row.name}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg"
        onClick={() => onEdit(row)}
        aria-label={`Edit ${row.name}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => onDelete(row)}
        aria-label={`Delete ${row.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function getPlantMasterColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (plant: PlantMasterRow) => void;
  onDelete: (plant: PlantMasterRow) => void;
}): ColumnDef<PlantMasterRow>[] {
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
      accessorKey: "name",
      header: "Plant Name",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-gray-900">{row.original.name}</p>
          <p className="text-xs text-gray-500 italic">{row.original.scientificName}</p>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-medium text-gray-700">{row.original.sku}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "subcategory",
      header: "Subcategory",
    },
    {
      accessorKey: "variantCount",
      header: "Variants",
      cell: ({ row }) => <span className="text-gray-700">{row.original.variantCount}</span>,
    },
    {
      accessorKey: "totalStock",
      header: "Total Stock",
      cell: ({ row }) => <span className="text-gray-700">{row.original.totalStock}</span>,
    },
    {
      accessorKey: "lowestPrice",
      header: "Starting Price",
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.lowestPrice !== null
            ? `\u20B9${row.original.lowestPrice.toFixed(0)}`
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge size="sm" color={row.original.status === "Active" ? "success" : "light"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <PlantActions row={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
  ];
}
