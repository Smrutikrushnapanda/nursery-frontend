"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Shapes } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { masterApis } from "@/utils/api/api";

type SubCateogryItem = {
  id: number;
  name: string;
  categoryId: number;
  organizationId?: string | null;
  category: any;
  created_at?: string;
  updated_at?: string;
};

type CategoryForm = {
  name: string;
  description: string;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Page() {
  const [categories, setCategories] = useState<SubCateogryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await masterApis.getCategories();
      setCategories(Array.isArray(response?.data) ? response.data : []);
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingCategoryId(null);
    setIsFormOpen(false);
  };

  const handleAddClick = () => {
    setForm(initialForm);
    setEditingCategoryId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: CategoryItem) => {
    setForm({
      name: category.name ?? "",
      description: category.description ?? "",
    });
    setEditingCategoryId(category.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (category: CategoryItem) => {
    try {

      await masterApis.deleteCategory(category.id.toString());
      await fetchCategories();
      setDeletingCategory(null);
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to delete category");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategoryId !== null) {
        await masterApis.updateCategory(editingCategoryId, form);
      } else {
        await masterApis.createCategory(form);
      }

      await fetchCategories();
      resetForm();
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<ColumnDef<CategoryItem>[]>(
    () => [
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
        cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
      },
      {
        accessorKey: "updated_at",
        header: "Updated",
        cell: ({ row }) => <span>{formatDate(row.original.updated_at)}</span>,
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
              onClick={() => handleEdit(row.original)}
              aria-label={`Edit ${row.original.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeletingCategory(row.original)}
              aria-label={`Delete ${row.original.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
        <div className=" w-full flex justify-end">

            <Button onClick={handleAddClick} className="rounded p-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
        </div>


      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border-2 border-brand-200/40 bg-white">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600" />
            <p className="mt-3 text-sm text-gray-500">Loading category master data...</p>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={categories} defaultPageSize={10} />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={resetForm}
        className="mx-4 max-w-2xl p-6 sm:p-8"
      >
        <div className="space-y-5">
          <div className="pr-12">
            <h2 className="text-2xl font-bold text-brand-800">
              {editingCategoryId !== null ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {editingCategoryId !== null
                ? "Update the selected category details."
                : "Create a new category for your nursery master data."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g., Indoor Plants"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe what this category is used for"
                rows={4}
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl">
                {saving
                  ? editingCategoryId !== null
                    ? "Updating..."
                    : "Adding..."
                  : editingCategoryId !== null
                    ? "Update Category"
                    : "Add Category"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        className="mx-4 max-w-md p-6 sm:p-8"
      >
        <div className="space-y-5">
          <div className="pr-12">
            <h2 className="text-2xl font-bold text-red-700">Delete Category</h2>
            <p className="mt-2 text-sm text-gray-600">
              {deletingCategory
                ? `This will soft delete "${deletingCategory.name}". You can’t undo this from the table.`
                : "This action will delete the selected category."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeletingCategory(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deletingCategory) {
                  void handleDelete(deletingCategory);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
