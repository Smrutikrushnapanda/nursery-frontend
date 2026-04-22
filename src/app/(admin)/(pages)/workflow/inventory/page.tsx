"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { StockFormDialog, StockFormState, StockVariantOption } from "@/components/inventory/StockFormDialog";
import { DataTable } from "@/components/tables/DataTable";
import { getInventoryColumns, InventoryItem } from "@/components/tables/Columns";
import { useAppStore } from "@/utils/store/store";
import { inventoryApis, masterApis } from "@/utils/api/api";
import { Button } from "@/components/ui/button";
import { TableLoader } from "@/components/table-loader/table-loader";

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
  const { isLoading, setLoading, stocks, setStocks } = useAppStore();
  const { getAllStocks, addStocks, updateStock } = inventoryApis;
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [stockForm, setStockForm] = useState<StockFormState>(initialStockForm);
  const [saving, setSaving] = useState(false);
  const [variantOptions, setVariantOptions] = useState<StockVariantOption[]>([]);
  const [viewingStock, setViewingStock] = useState<InventoryItem | null>(null);

  const getStocks = async () => {
    setLoading(true);
    try {
      const response = await getAllStocks();

      if (response.success) {
        setStocks(response.data);
      }
    } catch (error: any) {
      alert(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      alert(error?.message || "Failed to load plant variants");
    }
  };

  useEffect(() => {
    getStocks();
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
      alert(error?.message || "Failed to save stock");
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
      }),
    []
  );

  if (isLoading) return <TableLoader message="Loadibg Inventory..." />;

  return (
    <div className="p-6 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <Button className="bg-primary text-white p-2 rounded" onClick={handleAddOpen}>
          + Add Stock
        </Button>
      </div>

      <DataTable columns={columns} data={stocks ?? []} />

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
