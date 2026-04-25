import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubcategoryItem } from "@/app/(admin)/(pages)/master/sub-category/types";
import { formatSubCategoryDate } from "@/app/(admin)/(pages)/master/sub-category/utils";


type ColumnActions = {
  onEdit: (subCategory: SubcategoryItem) => void;
  onDelete: (subCategory: SubcategoryItem) => void;
};

export function getSubCategoryColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<SubcategoryItem>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "categoryId",
      header: "Category Name",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.original.categoryName ?? "-"}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Sub Category Name",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span>{formatSubCategoryDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => <span>{formatSubCategoryDate(row.original.updatedAt)}</span>,
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
