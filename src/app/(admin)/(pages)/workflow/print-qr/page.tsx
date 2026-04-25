"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { getPrintQrColumns } from "@/components/tables/printQrColumns";
import { InventoryItem } from "@/components/tables/inventoryColumns";
import { inventoryApis, masterApis } from "@/utils/api/api";
import { TableLoader } from "@/components/table-loader/table-loader";
import { Filter, FilterField } from "@/components/common/Filter";
import { Loader2, QrCode, Printer } from "lucide-react";
import { qrApis } from "@/utils/api/api";
import { sizeOptions } from "../../master/plant-variant/config";

export default function PrintQrPage() {
  const [stocks, setStocks] = useState<InventoryItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [generatedQrs, setGeneratedQrs] = useState<Record<number, string>>({});
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string; categoryId?: number }[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const { generateInBulk } = qrApis;

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: categories.map(c => ({ value: c.id, label: c.name })),
      placeholder: "All Categories"
    },
    {
      id: "subcategory",
      label: "Sub Category",
      type: "select",
      options: subCategories.map(s => ({ value: s.id, label: s.name })),
      placeholder: "All Sub Categories"
    },
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: sizeOptions.map(size => ({ value: size, label: size.replaceAll("_", " ") })),
      placeholder: "All Variants"
    },
    {
      id: "plantName",
      label: "Plant Name",
      type: "text",
      placeholder: "Search by plant name..."
    }
  ], [categories, subCategories]);

  const filteredStocks = useMemo(() => {
    return (stocks ?? []).filter(stock => {
      const plant = (stock.variant?.plant as any) ?? {};
      const categoryId = plant.category?.id ?? "";
      const subCategoryId = plant.subcategory?.id ?? "";
      const plantName = plant.name ?? "";
      const variantSize = stock.variant?.size ?? "";

      const categoryMatch = !filters.category || String(categoryId) === String(filters.category);
      const subCategoryMatch = !filters.subcategory || String(subCategoryId) === String(filters.subcategory);
      const plantMatch = !filters.plantName || plantName.toLowerCase().includes(filters.plantName.toLowerCase());
      const variantMatch = !filters.variant || variantSize === filters.variant;

      return categoryMatch && subCategoryMatch && plantMatch && variantMatch;
    });
  }, [stocks, filters]);

  const fetchStocks = async () => {
    setIsPageLoading(true);
    try {
      const response = await inventoryApis.getAllStocks();
      if (response.success) {
        setStocks(response.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        masterApis.getCategories(),
        masterApis.getSubCategories(),
      ]);

      const catData = Array.isArray(catRes?.data?.data)
        ? catRes.data.data
        : Array.isArray(catRes?.data)
          ? catRes.data
          : Array.isArray(catRes)
            ? catRes
            : [];

      const subData = Array.isArray(subRes?.data?.data)
        ? subRes.data.data
        : Array.isArray(subRes?.data)
          ? subRes.data
          : Array.isArray(subRes)
            ? subRes
            : [];

      setCategories(catData);
      setSubCategories(subData);
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchFilterOptions();
  }, []);

  const handleQrGenerated = (variantId: number, qrBase64: string) => {
    setGeneratedQrs(prev => ({
      ...prev,
      [variantId]: qrBase64
    }));
  };

  const handleGenerateBulk = async () => {
    if (!filters.category || !filters.subcategory) {
      alert("Select both category and sub-category to generate bulk QR codes.");
      return;
    }

    setIsBulkGenerating(true);
    try {
      const response = await generateInBulk(Number(filters.category), Number(filters.subcategory));
      alert(response?.message || "Bulk QR generation started successfully.");
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsBulkGenerating(false);
    }
  }

  const columns = useMemo(
    () => getPrintQrColumns({
      generatedQrs,
      onGenerated: handleQrGenerated
    }),
    [generatedQrs]
  );

  if (isPageLoading && stocks.length === 0) {
    return <TableLoader message="Loading inventory for QR generation..." />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="h-6 w-6 text-brand-600" />
            Print QR Codes
          </h1>
          <p className="text-gray-500 text-sm">Generate and download QR codes for your plant variants.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateBulk}
            disabled={isBulkGenerating || !filters.category || !filters.subcategory}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBulkGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="h-4 w-4" />
            )}
            {isBulkGenerating ? "Generating..." : "Generate Bulk QR"}
          </button>
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg border border-brand-100 flex items-center gap-2 text-xs font-medium">
            <Printer className="h-4 w-4" />
            Filter by category and sub-category for bulk QR generation
          </div>
        </div>
      </div>

      <Filter
        fields={filterFields}
        onFilter={setFilters}
        title="Inventory Search"
      />

      <div className="bg-white rounded-xl overflow-hidden relative">
        {isPageLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <TableLoader message="Refreshing data..." isOverlay />
          </div>
        )}
        <DataTable columns={columns} data={filteredStocks} />
      </div>
    </div>
  );
}
