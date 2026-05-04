"use client";
import { toast } from "sonner";


import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { StockFormDialog, StockFormState, StockVariantOption } from "@/components/inventory/StockFormDialog";
import { DeadStockDialog } from "@/components/inventory/DeadStockDialog";
import { DataTable } from "@/components/tables/DataTable";
import { getInventoryColumns, InventoryItem, getStockStatus } from "@/components/tables/inventoryColumns";
import { useAppStore } from "@/utils/store/store";
import { inventoryApis, masterApis } from "@/utils/api/api";
import { Button } from "@/components/ui/button";
import { TableLoader } from "@/components/table-loader/table-loader";
import { Filter, FilterField } from "@/components/common/Filter";
import { sizeOptions } from "../../master/plant-variant/config";

const initialStockForm: StockFormState = {
  variantId: "",
  quantity: "",
  reference: "",
  reason: "",
};

type VariantApiItem = {
  id: number;
  name?: string;
  sku?: string;
  size?: string;
  plant?: {
    name?: string;
  };
};

export default function InventoryPage() {
  const { stocks, setStocks } = useAppStore();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { getAllStocks, addStocks, updateStock } = inventoryApis;
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [stockForm, setStockForm] = useState<StockFormState>(initialStockForm);
  const [saving, setSaving] = useState(false);
  const [variantOptions, setVariantOptions] = useState<StockVariantOption[]>([]);
  const [viewingStock, setViewingStock] = useState<InventoryItem | null>(null);
  const [deadStockTarget, setDeadStockTarget] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: "categoryName",
      label: "Category",
      type: "select",
      options: categories.map(c => ({ value: c.name, label: c.name })),
      placeholder: "All Categories"
    },
    {
      id: "subCategoryName",
      label: "Sub Category",
      type: "select",
      options: subCategories.map(s => ({ value: s.name, label: s.name })),
      placeholder: "All Sub Categories"
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "In Stock", label: "In Stock" },
        { value: "Low Stock", label: "Low Stock" },
        { value: "Out of Stock", label: "Out of Stock" }
      ],
      placeholder: "All Status"
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { value: "TINY", label: "Tiny" },
        { value: "SMALL", label: "Small" },
        { value: "MEDIUM", label: "Medium" },
        { value: "LARGE", label: "Large" },
        { value: "EXTRA_LARGE", label: "Extra Large" }
      ],
      placeholder: "All Sizes"
    },
    {
      id: "activity",
      label: "QR Activity",
      type: "select",
      options: [
        { value: "generated", label: "QR Generated" },
        { value: "not_generated", label: "No QR" },
        { value: "most_scanned", label: "Most Scanned" },
        { value: "least_scanned", label: "Least Scanned" },
        { value: "recently_scanned", label: "Recently Scanned" },
        { value: "never_scanned", label: "Never Scanned" }
      ],
      placeholder: "All Activity"
    },
    {
      id: "minPrice",
      label: "Min Price",
      type: "text",
      placeholder: "Min \u20B9"
    },
    {
      id: "maxPrice",
      label: "Max Price",
      type: "text",
      placeholder: "Max \u20B9"
    },
    {
      id: "minQuantity",
      label: "Min Qty",
      type: "text",
      placeholder: "Min Qty"
    },
    {
      id: "maxQuantity",
      label: "Max Qty",
      type: "text",
      placeholder: "Max Qty"
    }
  ], [categories, subCategories]);

  const filteredStocks = useMemo(() => {
    return stocks ?? [];
  }, [stocks]);

  const getStocks = useCallback(async (filters?: any) => {
    setIsPageLoading(true);
    try {
      const response = await getAllStocks(filters);

      if (response.success) {
        setStocks(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsPageLoading(false);
    }
  }, [getAllStocks, setStocks]);

  const handleReset = useCallback(() => {
    void getStocks();
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, [getStocks]);

  const loadVariantOptions = async () => {
    try {
      const response = await masterApis.getAllPlantVariants();
      const rawVariants = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

      setVariantOptions(
        rawVariants.map((item: VariantApiItem) => ({
          id: Number(item?.id ?? 0),
          label: (() => {
            const fallbackLabel =
              [item?.plant?.name, item?.size].filter(Boolean).join(" - ") ||
              `Variant #${item?.id ?? "-"}`;

            return item?.name ?? fallbackLabel;
          })(),
        })).filter((item) => item.id > 0)
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to load plant variants");
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
    getStocks();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    loadVariantOptions();
  }, []);

  const resetDialog = () => {
    setDialogMode(null);
    setStockForm(initialStockForm);
  };

  const handleAddOpen = () => {
    setStockForm(initialStockForm);
    setDialogMode("add");
  };

  const handleEditOpen = (stock: InventoryItem) => {
    setStockForm({
      variantId: stock.variantId.toString(),
      quantity: stock.quantity.toString(),
      reference: "",
      reason: "Inventory adjustment",
    });
    setDialogMode("edit");
  };

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStockSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (dialogMode === "add") {
        await addStocks({
          variantId: Number(stockForm.variantId),
          quantity: Number(stockForm.quantity),
          reference: stockForm.reference.trim(),
        });
      }

      if (dialogMode === "edit") {
        await updateStock({
          variantId: Number(stockForm.variantId),
          quantity: Number(stockForm.quantity),
          reason: stockForm.reason.trim(),
        });
      }

      await getStocks();
      resetDialog();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to save stock");
    } finally {
      setSaving(false);
    }
  };

  const handleDeadStockSubmit = async (data: { variantId: number; quantity: number; reason: string }) => {
    setSaving(true);
    try {
      await inventoryApis.deadStock(data);
      await getStocks();
      setDeadStockTarget(null);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to mark dead stock");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () =>
      getInventoryColumns({
        onView: setViewingStock,
        onEdit: handleEditOpen,
        onDeleted: getStocks,
        onDeadStock: setDeadStockTarget,
      }),
    [getStocks]
  );

  const handleFilter = useCallback((vals: Record<string, any>) => {
    const filters: any = { ...vals };
    
    // Clean up empty strings and ensure numeric values where needed
    Object.keys(filters).forEach(key => {
      if (filters[key] === "" || filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    });

    void getStocks(filters);

    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, [getStocks]);

  const handleDownloadExcel = async () => {
    const { utils, writeFile } = await import('xlsx');
    
    if (!stocks || stocks.length === 0) return;

    const worksheet = utils.json_to_sheet(stocks.map(s => ({
       ID: s.id,
       Plant: s.variant?.plant?.name || "-",
       SKU: s.variant?.sku || "-",
       Size: s.variant?.size || "-",
       Quantity: s.quantity,
       Status: getStockStatus(s),
       LastUpdated: new Date(s.updatedAt).toLocaleString()
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Inventory");
    writeFile(workbook, `inventory_master_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          Inventory
        </h1>
        <Button className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-all active:scale-95" onClick={handleAddOpen}>
          + Add Stock
        </Button>
      </div>

      <Filter
        fields={filterFields}
        onFilter={handleFilter}
        onReset={handleReset}
        title="Stock Filters"
      />

      {isPageLoading ? (
        <TableLoader message="Loading Inventory..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredStocks ?? []}
          pagination={pagination}
          onPaginationChange={setPagination}
          onDownloadAll={handleDownloadExcel}
        />
      )}

      {dialogMode ? (
        <StockFormDialog
          isOpen={Boolean(dialogMode)}
          mode={dialogMode}
          form={stockForm}
          saving={saving}
          variantOptions={variantOptions}
          onClose={resetDialog}
          onInputChange={handleStockInputChange}
          onVariantChange={(value) => setStockForm((prev) => ({ ...prev, variantId: value }))}
          onSubmit={handleStockSubmit}
        />
      ) : null}

      <DeadStockDialog
        isOpen={Boolean(deadStockTarget)}
        stockItem={deadStockTarget}
        saving={saving}
        onClose={() => setDeadStockTarget(null)}
        onSubmit={handleDeadStockSubmit}
      />

      <DashboardDialog
        isOpen={Boolean(viewingStock)}
        onClose={() => setViewingStock(null)}
        title="Stock Details"
        description="Current stock details for the selected variant."
        className="mx-4 max-w-xl p-6 sm:p-8"
      >
        {viewingStock ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-gray-500">Plant</p>
              <p className="font-medium text-gray-900">{viewingStock.variant?.plant?.name ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">SKU</p>
              <p className="font-medium text-gray-900">{viewingStock.variant?.sku ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Variant Size</p>
              <p className="font-medium text-gray-900">{viewingStock.variant?.size ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">{viewingStock.quantity}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Min Quantity</p>
              <p className="font-medium text-gray-900">{Number(viewingStock.variant?.minQuantity ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(viewingStock.updatedAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ) : null}
      </DashboardDialog>
    </div>
  );
}
