"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { useState, useEffect } from "react";
import { InventoryItem } from "@/components/tables/Columns";

type Props = {
  isOpen: boolean;
  stockItem: InventoryItem | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: { variantId: number; quantity: number; reason: string }) => void;
};

export function DeadStockDialog({
  isOpen,
  stockItem,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItem) return;

    onSubmit({
      variantId: stockItem.variantId,
      quantity: Number(quantity),
      reason: reason.trim(),
    });
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Mark as Dead Stock"
      description={`Mark some or all stock of "${stockItem?.variant?.plant?.name ?? "this item"}" as dead.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="deadQuantity">
            Quantity to mark as dead <span className="text-red-500">*</span>
          </Label>
          <Input
            id="deadQuantity"
            type="number"
            min="1"
            max={stockItem?.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Available: ${stockItem?.quantity ?? 0}`}
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadReason">
            Reason <span className="text-red-500">*</span>
          </Label>
          <Input
            id="deadReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Plant withered, Pest damage"
            required
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || !quantity || !reason.trim() || Number(quantity) > (stockItem?.quantity ?? 0)}
            className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
          >
            {saving ? "Marking..." : "Mark as Dead"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
