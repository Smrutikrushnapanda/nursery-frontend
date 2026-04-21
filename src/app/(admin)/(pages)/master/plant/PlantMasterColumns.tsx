"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { masterApis } from "@/utils/api/api";
import { PlantMasterRow } from "./PlantMasterData";

function PlantActions({ row }: { row: PlantMasterRow }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${row.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await masterApis.deletePlant(Number(row.id));
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      alert(error?.message || "Failed to delete plant");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="icon" variant="outline" className="h-8 w-8 rounded-lg">
        <Link href={`/plant/${row.id}`} aria-label={`View ${row.name}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild size="icon" variant="outline" className="h-8 w-8 rounded-lg">
        <Link
          href={`/master/plant/add-plant?edit=${row.id}`}
          aria-label={`Edit ${row.name}`}
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleDelete}
        aria-label={`Delete ${row.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const plantMasterColumns: ColumnDef<PlantMasterRow>[] = [
  {
    accessorKey: "name",
    header: "Plant Name",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-gray-900">{row.original.name}</p>
        <p className="text-xs text-gray-500">{row.original.scientificName}</p>
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
    cell: ({ row }) => <PlantActions row={row.original} />,
  },
];
