"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DashboardConfirmDialog } from "@/components/common/DashboardConfirmDialog";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { TableLoader } from "@/components/table-loader/table-loader";
import { DataTable } from "@/components/tables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masterApis } from "@/utils/api/api";
import { Filter, FilterField } from "@/components/common/Filter";
import { initialForm, sizeOptions } from "./config";
import {
  buildVariantPayload,
  formatVariantDate,
  getVariantStatus,
  mapVariantToForm,
  normalizePlantOption,
  normalizePlantVariant,
} from "./utils";
import { PlantOption, PlantVariantForm, PlantVariantItem } from "./types";

export default function Page() {
  const [variants, setVariants] = useState<PlantVariantItem[]>([]);
  const [plants, setPlants] = useState<PlantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<PlantVariantItem | null>(null);
  const [viewingVariant, setViewingVariant] = useState<PlantVariantItem | null>(null);
  const [form, setForm] = useState<PlantVariantForm>(initialForm);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: "plant",
      label: "Plant Name",
      type: "text",
      placeholder: "Search by plant..."
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: sizeOptions.map(size => ({ value: size, label: size.replaceAll("_", " ") })),
      placeholder: "All Sizes"
    },
    {
      id: "stockStatus",
      label: "Stock Status",
      type: "select",
      options: [
        { value: "In Stock", label: "In Stock" },
        { value: "Low Stock", label: "Low Stock" },
        { value: "Out of Stock", label: "Out of Stock" }
      ],
      placeholder: "All Status"
    }
  ], []);

  const filteredVariants = useMemo(() => {
    return variants.filter(variant => {
      const plantName = variant.plant?.name ?? "";
      const size = variant.size;
      const status = getVariantStatus(variant);

      const plantMatch = !filters.plant || plantName.toLowerCase().includes(filters.plant.toLowerCase());
      const sizeMatch = !filters.size || size === filters.size;
      const statusMatch = !filters.stockStatus || status === filters.stockStatus;

      return plantMatch && sizeMatch && statusMatch;
    });
  }, [variants, filters]);

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, []);

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await masterApis.getAllPlantVariants();
      const rawVariants = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setVariants(rawVariants.map(normalizePlantVariant));
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Failed to load plant variants");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await masterApis.getAllPlants();
      const rawPlants = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setPlants(rawPlants.map(normalizePlantOption).filter((item) => item.id > 0));
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to load plants");
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchPlants();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingVariantId(null);
    setIsFormOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setForm(initialForm);
    setEditingVariantId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (variant: PlantVariantItem) => {
    setForm(mapVariantToForm(variant));
    setEditingVariantId(variant.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (variant: PlantVariantItem) => {
    setDeleting(true);
    try {
      await masterApis.deletePlantVariant(variant.id);
      await fetchVariants();
      setDeletingVariant(null);
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to delete plant variant");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = buildVariantPayload(form);

      if (editingVariantId !== null) {
        await masterApis.updatePlantVariant(editingVariantId, payload);
      } else {
        await masterApis.createPlantVariant(payload);
      }

      await fetchVariants();
      resetForm();
    } catch (err: any) {
      console.log(err);
      alert(err?.message || "Failed to save plant variant");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<ColumnDef<PlantVariantItem>[]>(
    () => [
      {
        id: "slNo",
        header: "Sl No",
        cell: ({ row }) => (
          <span className="text-gray-500 font-medium">{row.index + 1}</span>
        ),
        size: 50,
      },
      {
        accessorKey: "plant.name",
        header: "Plant",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <p className="font-semibold text-gray-900">{row.original.plant?.name ?? "-"}</p>
            <p className="text-xs text-gray-500 italic">{row.original.plant?.scientificName ?? "-"}</p>
          </div>
        ),
      },
      {
        accessorKey: "size",
        header: "Size",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="text-gray-700">{`\u20B9${Number(row.original.price ?? 0).toFixed(0)}`}</span>
        ),
      },
      {
        accessorKey: "stockQuantity",
        header: "Stock",
        cell: ({ row }) => <span className="text-gray-700">{row.original.stockQuantity ?? 0}</span>,
      },
      {
        accessorKey: "minQuantity",
        header: "Min Qty",
        cell: ({ row }) => <span className="text-gray-700">{Number(row.original.minQuantity ?? 0)}</span>,
      },
      {
        accessorKey: "stockStatus",
        header: "Stock Status",
        cell: ({ row }) => {
          const status = getVariantStatus(row.original);
          return (
            <Badge
              size="sm"
              color={status === "In Stock" ? "success" : status === "Low Stock" ? "warning" : "error"}
            >
              {status}
            </Badge>
          );
        },
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
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg"
              onClick={() => setViewingVariant(row.original)}
              aria-label={`View ${row.original.plant?.name}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg"
              onClick={() => handleEdit(row.original)}
              aria-label={`Edit ${row.original.plant?.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeletingVariant(row.original)}
              aria-label={`Delete ${row.original.plant?.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDownloadExcel = async () => {
    const { utils, writeFile } = await import('xlsx');
    
    if (variants.length === 0) return;

    const worksheet = utils.json_to_sheet(variants.map(v => ({
       ID: v.id,
       Plant: v.plant?.name || "-",
       Size: v.size,
       Price: v.price,
       Stock: v.stockQuantity,
       MinQty: v.minQuantity,
       Status: v.status ? "Active" : "Inactive"
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Variants");
    writeFile(workbook, `variants_master_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-end">
        <Button className="bg-primary text-white p-2 rounded" onClick={handleAddClick}>
          + Add Plant Variant
        </Button>
      </div>

      <Filter 
        fields={filterFields} 
        onFilter={handleFilter} 
        title="Variant Filters"
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <TableLoader message="Loading plant variant master data..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredVariants}
          defaultPageSize={10}
          pagination={pagination}
          onPaginationChange={setPagination}
          onDownloadAll={handleDownloadExcel}
        />
      )}

      <DashboardDialog
        isOpen={isFormOpen}
        onClose={resetForm}
        title={editingVariantId !== null ? "Edit Plant Variant" : "Add Plant Variant"}
        description={
          editingVariantId !== null
            ? "Update the selected plant variant details."
            : "Create a new plant variant for your nursery master data."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plantId">
                Plant <span className="text-red-500">*</span>
              </Label>
              <select
                id="plantId"
                name="plantId"
                value={form.plantId}
                onChange={(e) => setForm((prev) => ({ ...prev, plantId: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                required
              >
                <option value="">Select plant</option>
                {plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">
                Size <span className="text-red-500">*</span>
              </Label>
              <select
                id="size"
                name="size"
                value={form.size}
                onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                required
              >
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleInputChange}
                placeholder="e.g., 199.99"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mockPrice">Mock Price</Label>
              <Input
                id="mockPrice"
                name="mockPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.mockPrice}
                onChange={handleInputChange}
                placeholder="e.g., 249.99"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minQuantity">Min Quantity</Label>
              <Input
                id="minQuantity"
                name="minQuantity"
                type="number"
                min="0"
                step="1"
                value={form.minQuantity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="rounded-xl" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !form.plantId || !form.price.trim()}
              className="rounded-xl"
            >
              {saving
                ? editingVariantId !== null
                  ? "Updating..."
                  : "Adding..."
                : editingVariantId !== null
                  ? "Update Plant Variant"
                  : "Add Plant Variant"}
            </Button>
          </div>
        </form>
      </DashboardDialog>

      <DashboardConfirmDialog
        isOpen={Boolean(deletingVariant)}
        onClose={() => {
          if (!deleting) {
            setDeletingVariant(null);
          }
        }}
        onConfirm={() => {
          if (deletingVariant && !deleting) {
            void handleDelete(deletingVariant);
          }
        }}
        title="Delete Plant Variant"
        description={
          deletingVariant
            ? `This will delete this variant of "${deletingVariant.plant?.name}". You can't undo this from the table.`
            : "This action will delete the selected plant variant."
        }
        confirmLabel="Delete"
        loading={deleting}
        loadingLabel="Deleting..."
      />

      <DashboardDialog
        isOpen={Boolean(viewingVariant)}
        onClose={() => setViewingVariant(null)}
        title="Plant Variant Details"
        description="Current details for the selected plant variant."
        className="mx-4 max-w-xl p-6 sm:p-8"
      >
        {viewingVariant ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-gray-500">Plant</p>
              <p className="font-medium text-gray-900">{viewingVariant.plant?.name ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Size</p>
              <p className="font-medium text-gray-900">{viewingVariant.size}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Price</p>
              <p className="font-medium text-gray-900">
                {`\u20B9${Number(viewingVariant.price ?? 0).toFixed(2)}`}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Mock Price</p>
              <p className="font-medium text-gray-900">
                {viewingVariant.mockPrice
                  ? `\u20B9${Number(viewingVariant.mockPrice).toFixed(2)}`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Stock Quantity</p>
              <p className="font-medium text-gray-900">{viewingVariant.stockQuantity ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Min Quantity</p>
              <p className="font-medium text-gray-900">{Number(viewingVariant.minQuantity ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Created</p>
              <p className="font-medium text-gray-900">{formatVariantDate(viewingVariant.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Updated</p>
              <p className="font-medium text-gray-900">{formatVariantDate(viewingVariant.updatedAt)}</p>
            </div>
          </div>
        ) : null}
      </DashboardDialog>
    </div>
  );
}
