"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardConfirmDialog } from "@/components/common/DashboardConfirmDialog";
import { DataTable } from "@/components/tables/DataTable";
import { masterApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { initialForm } from "./config";
import { SubcategoryForm, SubcategoryItem } from "./types";
import { normalizeSubCategory } from "./utils";
import { getSubCategoryColumns } from "@/components/sub-categories/subCategoryColumns";
import { SubCategoryToolbar } from "@/components/sub-categories/SubCategoryToolbar";
import { SubCategoryFormDialog } from "@/components/sub-categories/SubCategoryFormDialog";
import { TableLoader } from "@/components/table-loader/table-loader";

export default function Page() {
  const [subCategories, setSubCategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubcategoryItem | null>(null);
  const [form, setForm] = useState<SubcategoryForm>(initialForm);
  const { masterCategories, setMasterCategories } = useAppStore();

  const fetchCategories = async () => {
    try {
      const response = await masterApis.getCategories();
      setMasterCategories(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!Array.isArray(masterCategories) || masterCategories.length === 0) {
      fetchCategories();
    }
  }, []);

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (Array.isArray(masterCategories) ? masterCategories : [])
            .filter((item) => (item?.id ?? item?.categoryId) && (item?.name ?? item?.categoryName))
            .map((item) => [
              item?.id ?? item?.categoryId,
              {
                id: item?.id ?? item?.categoryId,
                name: item?.name ?? item?.categoryName,
              },
            ])
        ).values()
      ),
    [masterCategories]
  );

  const fetchPageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const subCategoriesResponse = await masterApis.getSubCategories();
      setSubCategories(
        Array.isArray(subCategoriesResponse?.data)
          ? subCategoriesResponse.data.map(normalizeSubCategory)
          : []
      );
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Failed to load sub-categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingSubCategoryId(null);
    setIsFormOpen(false);
  };

  const handleAddClick = () => {
    setForm(initialForm);
    setEditingSubCategoryId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (subCategory: SubcategoryItem) => {
    setForm({
      name: subCategory.name ?? "",
      categoryId: subCategory.categoryId ? subCategory.categoryId.toString() : "",
    });
    setEditingSubCategoryId(subCategory.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (subCategory: SubcategoryItem) => {
    try {
      await masterApis.deleteSubCategory(subCategory.id);
      await fetchPageData();
      setDeletingSubCategory(null);
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to delete sub-category");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
      };

      if (editingSubCategoryId !== null) {
        await masterApis.updateSubCategory(editingSubCategoryId, payload);
      } else {
        await masterApis.createSubCategory(payload);
      }

      await fetchPageData();
      resetForm();
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to save sub-category");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () =>
      getSubCategoryColumns({
        onEdit: handleEdit,
        onDelete: setDeletingSubCategory,
      }),
    []
  );

  return (
    <div className="space-y-6">
      <SubCategoryToolbar onAddClick={handleAddClick} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
       <TableLoader message="Loading sub-categories..." />
      ) : (
        <DataTable columns={columns} data={subCategories} defaultPageSize={10} />
      )}

      <SubCategoryFormDialog
        isOpen={isFormOpen}
        isEditing={editingSubCategoryId !== null}
        form={form}
        saving={saving}
        categoryOptions={categoryOptions}
        onClose={resetForm}
        onInputChange={handleInputChange}
        onCategoryChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
        onSubmit={handleSubmit}
      />

      <DashboardConfirmDialog
        isOpen={Boolean(deletingSubCategory)}
        onClose={() => setDeletingSubCategory(null)}
        onConfirm={() => {
          if (deletingSubCategory) {
            void handleDelete(deletingSubCategory);
          }
        }}
        title="Delete Sub Category"
        description={
          deletingSubCategory
            ? `This will delete "${deletingSubCategory.name}". You can't undo this from the table.`
            : "This action will delete the selected sub-category."
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
