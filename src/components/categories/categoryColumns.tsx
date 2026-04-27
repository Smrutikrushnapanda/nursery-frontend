import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { CategoryItem } from "@/app/(admin)/(pages)/master/category/types";
import { formatCategoryDate } from "@/app/(admin)/(pages)/master/category/utils";

type ColumnActions = {
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
};

export function getCategoryColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<CategoryItem>[] {
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
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="block max-w-xs truncate text-gray-600">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge size="sm" color={row.original.status ? "success" : "light"}>
          {row.original.status ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <span>{formatCategoryDate(row.original.created_at)}</span>,
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => <span>{formatCategoryDate(row.original.updated_at)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-lg"
            onClick={() => onEdit(row.original)}
            aria-label={`Edit ${row.original.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(row.original)}
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
