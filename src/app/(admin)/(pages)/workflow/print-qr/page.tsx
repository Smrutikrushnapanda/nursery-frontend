"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { DataTable } from "@/components/tables/DataTable";
import { getPrintQrColumns } from "@/components/tables/printQrColumns";
import { InventoryItem } from "@/components/tables/inventoryColumns";
import { inventoryApis, masterApis } from "@/utils/api/api";
import { TableLoader } from "@/components/table-loader/table-loader";
import { Filter, FilterField } from "@/components/common/Filter";
import { Loader2, QrCode, Printer, Download } from "lucide-react";
import { qrApis } from "@/utils/api/api";
import { sizeOptions } from "../../master/plant-variant/config";
import { Button } from "@/components/ui/button";

type BulkQrFormState = {
  categoryId: string;
  subcategoryId: string;
  plantIds: number[];
};

const initialBulkQrForm: BulkQrFormState = {
  categoryId: "",
  subcategoryId: "",
  plantIds: [],
};

export default function PrintQrPage() {
  const [stocks, setStocks] = useState<InventoryItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [generatedQrs, setGeneratedQrs] = useState<Record<number, string>>({});
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string; categoryId?: number }[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkQrForm, setBulkQrForm] = useState<BulkQrFormState>(initialBulkQrForm);
  const [hasGeneratedBulk, setHasGeneratedBulk] = useState(false);
  const [newlyGeneratedIds, setNewlyGeneratedIds] = useState<number[]>([]);

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

  const bulkSubCategoryOptions = useMemo(() => {
    if (!bulkQrForm.categoryId) return [];

    return subCategories.filter(
      (subCategory) => String(subCategory.categoryId ?? "") === bulkQrForm.categoryId
    );
  }, [bulkQrForm.categoryId, subCategories]);

  const bulkPlantOptions = useMemo(() => {
    if (!bulkQrForm.categoryId || !bulkQrForm.subcategoryId) return [];

    const uniquePlants = new Map<number, { id: number; name: string; scientificName?: string }>();

    for (const stock of stocks ?? []) {
      const plant = stock.variant?.plant as any;
      const plantId = Number(plant?.id ?? 0);
      const categoryId = String(plant?.category?.id ?? "");
      const subcategoryId = String(plant?.subcategory?.id ?? "");

      if (
        plantId > 0 &&
        categoryId === bulkQrForm.categoryId &&
        subcategoryId === bulkQrForm.subcategoryId &&
        !uniquePlants.has(plantId)
      ) {
        uniquePlants.set(plantId, {
          id: plantId,
          name: plant?.name ?? `Plant #${plantId}`,
          scientificName: plant?.scientificName ?? "",
        });
      }
    }

    return Array.from(uniquePlants.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [bulkQrForm.categoryId, bulkQrForm.subcategoryId, stocks]);

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

  const handleQrGenerated = useCallback((variantId: number, qrImageBase64: string) => {
    setGeneratedQrs((prev) => ({
      ...prev,
      [variantId]: qrImageBase64,
    }));
  }, []);

  const openBulkDialog = () => {
    setBulkQrForm(initialBulkQrForm);
    setIsBulkDialogOpen(true);
  };

  const closeBulkDialog = () => {
    setIsBulkDialogOpen(false);
    setBulkQrForm(initialBulkQrForm);
  };

  const handleBulkCategoryChange = (categoryId: string) => {
    setBulkQrForm({
      categoryId,
      subcategoryId: "",
      plantIds: [],
    });
  };

  const handleBulkSubCategoryChange = (subcategoryId: string) => {
    setBulkQrForm((prev) => ({
      ...prev,
      subcategoryId,
      plantIds: [],
    }));
  };

  const handleBulkPlantToggle = (plantId: number) => {
    setBulkQrForm((prev) => {
      const isSelected = prev.plantIds.includes(plantId);

      if (isSelected) {
        return {
          ...prev,
          plantIds: prev.plantIds.filter((id) => id !== plantId),
        };
      }

      if (prev.plantIds.length >= 3) {
        alert("You can select a maximum of 3 plants.");
        return prev;
      }

      return {
        ...prev,
        plantIds: [...prev.plantIds, plantId],
      };
    });
  };

  const handleGenerateBulk = async () => {
    if (!bulkQrForm.categoryId || !bulkQrForm.subcategoryId) {
      alert("Select both category and sub-category.");
      return;
    }

    if (bulkQrForm.plantIds.length === 0) {
      alert("Select at least one plant.");
      return;
    }

    setIsBulkGenerating(true);
    try {
      const response = await generateInBulk(
        Number(bulkQrForm.categoryId),
        Number(bulkQrForm.subcategoryId),
        bulkQrForm.plantIds
      );
      setHasGeneratedBulk(true);

      const generatedItems = Array.isArray(response?.data?.generated)
        ? response.data.generated
        : [];

      if (generatedItems.length > 0) {
        setNewlyGeneratedIds(generatedItems.map((item: any) => Number(item?.variantId)).filter(id => !!id));
        setGeneratedQrs((prev) => {
          const next = { ...prev };

          for (const item of generatedItems) {
            const plantId = Number(item?.plantId ?? 0);
            const qrImageBase64 = item?.qrImageBase64;

            if (!plantId || typeof qrImageBase64 !== "string" || !qrImageBase64) {
              continue;
            }

            for (const stock of stocks ?? []) {
              const stockPlantId = Number((stock.variant?.plant as any)?.id ?? 0);

              if (stockPlantId === plantId) {
                next[stock.variantId] = qrImageBase64;
              }
            }
          }

          return next;
        });
      }

      const summary = response?.data?.summary;
      const generatedCount = Number(summary?.generated ?? generatedItems.length ?? 0);
      const skippedCount = Number(summary?.skipped ?? 0);

      alert(
        response?.message ||
        `Bulk QR generation completed. Generated: ${generatedCount}, Skipped: ${skippedCount}.`
      );
      closeBulkDialog();
    } catch (error: any) {
      alert(error?.message || "Failed to generate bulk QR codes.");
    } finally {
      setIsBulkGenerating(false);
    }
  };

  const handleDownloadPdf = async (mode: 'existing' | 'new' = 'existing') => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      let itemsToPrint = filteredStocks.filter(s => s.qrCode?.qrImageBase64 || generatedQrs[s.variantId]);
      
      if (mode === 'new') {
        itemsToPrint = itemsToPrint.filter(s => newlyGeneratedIds.includes(s.variantId));
      } else {
        itemsToPrint = itemsToPrint.filter(s => !newlyGeneratedIds.includes(s.variantId) && Number(s.qrCode?.alreadyGenerated) === 1);
      }
      
      if (itemsToPrint.length === 0) {
        alert(`No ${mode} QR codes found to download.`);
        return;
      }

      let x = 15;
      let y = 15;
      const qrSize = 40;
      const margin = 15;
      const rowSpacing = 25;
      const itemsPerRow = 3;
      const rowsPerPage = 4;
      const itemsPerPage = itemsPerRow * rowsPerPage;

      itemsToPrint.forEach((item, index) => {
        if (index > 0 && index % itemsPerPage === 0) {
          doc.addPage();
          x = 15;
          y = 15;
        }

        const imgData = item.qrCode?.qrImageBase64 || generatedQrs[item.variantId];
        if (!imgData) return;

        doc.addImage(imgData, "PNG", x, y, qrSize, qrSize);
        
        const centerX = x + (qrSize / 2);
        const textY = y + qrSize + 5;
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(item.variant?.plant?.name || "Unknown", centerX, textY, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Size: ${item.variant?.size || "N/A"}`, centerX, textY + 5, { align: "center" });
        
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(`P-ID: ${item.variant?.plant?.id} | V-ID: ${item.variantId}`, centerX, textY + 9, { align: "center" });
        doc.setTextColor(0, 0, 0);

        if ((index + 1) % itemsPerRow === 0) {
          x = 15;
          y += qrSize + rowSpacing;
        } else {
          x += qrSize + margin + 10;
        }
      });

      doc.save(`${mode}-qr-codes-${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const columns = useMemo(
    () => getPrintQrColumns({
      generatedQrs,
      onGenerated: handleQrGenerated,
      pagination,
    }),
    [generatedQrs, handleQrGenerated, pagination]
  );

  const handleFilter = useCallback((vals: Record<string, any>) => {
    setFilters(vals);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, []);

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
            onClick={openBulkDialog}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700"
          >
            {isBulkGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="h-4 w-4" />
            )}
            {isBulkGenerating ? "Generating..." : "Generate Bulk QR"}
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPdf('existing')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
          >
            <Download className="h-4 w-4 text-blue-600" />
            Download Existing QRs
          </button>

          {newlyGeneratedIds.length > 0 && (
            <button
              type="button"
              onClick={() => handleDownloadPdf('new')}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm transition-all hover:bg-brand-100 active:scale-95 animate-in fade-in slide-in-from-right-2"
            >
              <Download className="h-4 w-4 text-brand-600" />
              Download Newly Generated
            </button>
          )}

          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg border border-brand-100 flex items-center gap-2 text-xs font-medium">
            <Printer className="h-4 w-4" />
            Filter by category and sub-category for bulk QR generation
          </div>
        </div>
      </div>

      <Filter
        fields={filterFields}
        onFilter={handleFilter}
        title="Inventory Search"
      />

      <div className="bg-white rounded-xl overflow-hidden relative">
        {isPageLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <TableLoader message="Refreshing data..." isOverlay />
          </div>
        )}
        <DataTable
          columns={columns}
          data={filteredStocks}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      <DashboardDialog
        isOpen={isBulkDialogOpen}
        onClose={closeBulkDialog}
        title="Generate Bulk QR Codes"
        description="Select a category, a sub-category, and up to 3 plants to generate QR codes in bulk."
        className="mx-4 max-w-3xl p-6 sm:p-8"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={bulkQrForm.categoryId}
                onChange={(event) => handleBulkCategoryChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sub-category</label>
              <select
                value={bulkQrForm.subcategoryId}
                onChange={(event) => handleBulkSubCategoryChange(event.target.value)}
                disabled={!bulkQrForm.categoryId}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="">Select sub-category</option>
                {bulkSubCategoryOptions.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Plants</h3>
                <p className="text-xs text-gray-500">Select up to 3 plants.</p>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                {bulkQrForm.plantIds.length}/3 selected
              </span>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/50 p-3">
              {bulkPlantOptions.length > 0 ? (
                bulkPlantOptions.map((plant) => {
                  const isSelected = bulkQrForm.plantIds.includes(plant.id);
                  const isDisabled = !isSelected && bulkQrForm.plantIds.length >= 3;

                  return (
                    <label
                      key={plant.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-all ${isSelected
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 bg-white"
                        } ${isDisabled ? "cursor-not-allowed opacity-60" : "hover:border-brand-300"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleBulkPlantToggle(plant.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{plant.name}</p>
                        {plant.scientificName ? (
                          <p className="text-xs italic text-gray-500">{plant.scientificName}</p>
                        ) : null}
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  Select a category and sub-category to view available plants.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="rounded-xl" onClick={closeBulkDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleGenerateBulk}
              disabled={
                isBulkGenerating ||
                !bulkQrForm.categoryId ||
                !bulkQrForm.subcategoryId ||
                bulkQrForm.plantIds.length === 0
              }
            >
              {isBulkGenerating ? "Generating..." : "Generate Bulk QR"}
            </Button>
          </div>
        </div>
      </DashboardDialog>
    </div>
  );
}
