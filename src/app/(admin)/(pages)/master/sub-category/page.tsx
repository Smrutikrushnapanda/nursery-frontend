"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Filter, FilterField } from "@/components/common/Filter";

export default function Page() {
  const [subCategories, setSubCategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubcategoryItem | null>(null);
  const [form, setForm] = useState<SubcategoryForm>(initialForm);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { masterCategories, setMasterCategories } = useAppStore();

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

  const subCategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          subCategories
            .map((subCategory) => subCategory.name?.trim())
            .filter((name): name is string => Boolean(name))
        )
      ).map((name) => ({ value: name, label: name })),
    [subCategories]
  );

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        id: "category",
        label: "Category",
        type: "select",
        options: categoryOptions.map((cat) => ({ value: cat.name, label: cat.name })),
        placeholder: "All Categories",
      },
      {
        id: "subcategory",
        label: "Sub-category",
        type: "select",
        options: subCategoryOptions,
        placeholder: "All Sub-categories",
      },
    ],
    [categoryOptions, subCategoryOptions]
  );

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(sub => {
      const categoryName = sub.categoryName ?? "";
      const subCategoryName = sub.name ?? "";

      const categoryMatch = !filters.category || categoryName === filters.category;
      const subCategoryMatch = !filters.subcategory || subCategoryName === filters.subcategory;

      return categoryMatch && subCategoryMatch;
    });
  }, [subCategories, filters]);

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await masterApis.getCategories();
      setMasterCategories(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    if (!Array.isArray(masterCategories) || masterCategories.length === 0) {
      fetchCategories();
    }
  }, []);

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
    setDeleting(true);
    try {
      await masterApis.deleteSubCategory(subCategory.id);
      await fetchPageData();
      setDeletingSubCategory(null);
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to delete sub-category");
    } finally {
      setDeleting(false);
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

      <Filter 
        fields={filterFields} 
        onFilter={handleFilter} 
        title="Sub-category Filters"
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
       <TableLoader message="Loading sub-categories..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSubCategories}
          defaultPageSize={10}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
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
        onClose={() => {
          if (!deleting) {
            setDeletingSubCategory(null);
          }
        }}
        onConfirm={() => {
          if (deletingSubCategory && !deleting) {
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
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
}
