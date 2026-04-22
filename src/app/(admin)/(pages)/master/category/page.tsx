"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardConfirmDialog } from "@/components/common/DashboardConfirmDialog";
import { DataTable } from "@/components/tables/DataTable";
import { masterApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { initialForm } from "./config";
import { CategoryForm, CategoryItem } from "./types";
import { getCategoryColumns } from "@/components/categories/categoryColumns";
import { CategoryToolbar } from "@/components/categories/CategoryToolbar";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { TableLoader } from "@/components/table-loader/table-loader";

export default function Page() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);
  const { setMasterCategories } = useAppStore();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await masterApis.getCategories();
      const nextCategories = Array.isArray(response?.data?.data) ? response.data.data : [];
      setMasterCategories(nextCategories);
      setCategories(nextCategories);
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

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: handleEdit,
        onDelete: setDeletingCategory,
      }),
    []
  );

  return (
    <div className="space-y-6">
      <CategoryToolbar onAddClick={handleAddClick} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <TableLoader message="Loading category master data..." />
      ) : (
        <DataTable columns={columns} data={categories} defaultPageSize={10} />
      )}

      <CategoryFormDialog
        isOpen={isFormOpen}
        isEditing={editingCategoryId !== null}
        form={form}
        saving={saving}
        onClose={resetForm}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      <DashboardConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            void handleDelete(deletingCategory);
          }
        }}
        title="Delete Category"
        description={
          deletingCategory
            ? `This will soft delete "${deletingCategory.name}". You can't undo this from the table.`
            : "This action will delete the selected category."
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
