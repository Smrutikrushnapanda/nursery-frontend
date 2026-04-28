"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Filter, FilterField } from "@/components/common/Filter";

export default function Page() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { setMasterCategories } = useAppStore();

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          categories
            .map((category) => category.name?.trim())
            .filter((name): name is string => Boolean(name))
        )
      ).map((name) => ({ value: name, label: name })),
    [categories]
  );

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        id: "category",
        label: "Category Name",
        type: "select",
        options: categoryOptions,
        placeholder: "All Categories",
      },
    ],
    [categoryOptions]
  );

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const categoryName = category.name ?? "";
      const categoryMatch = !filters.category || categoryName === filters.category;
      return categoryMatch;
    });
  }, [categories, filters]);

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, []);

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
    setDeleting(true);
    try {
      await masterApis.deleteCategory(category.id.toString());
      await fetchCategories();
      setDeletingCategory(null);
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
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

      <Filter 
        fields={filterFields} 
        onFilter={handleFilter} 
        title="Category Filters"
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <TableLoader message="Loading category master data..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          defaultPageSize={10}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
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
        onClose={() => {
          if (!deleting) {
            setDeletingCategory(null);
          }
        }}
        onConfirm={() => {
          if (deletingCategory && !deleting) {
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
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
}
