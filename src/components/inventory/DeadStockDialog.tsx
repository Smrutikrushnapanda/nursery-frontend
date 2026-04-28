"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { useState, useEffect } from "react";
import { InventoryItem } from "@/components/tables/inventoryColumns";
import { FormField } from "@/components/common/FormField";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
      setReason("");
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const qtyNum = Number(quantity);
    const available = stockItem?.quantity ?? 0;

    if (!quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (qtyNum <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    } else if (qtyNum > available) {
      newErrors.quantity = `Only ${available} units available`;
    }

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItem) return;

    if (validate()) {
      onSubmit({
        variantId: stockItem.variantId,
        quantity: Number(quantity),
        reason: reason.trim(),
      });
    }
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Mark as Dead Stock"
      description={`Mark some or all stock of "${stockItem?.variant?.plant?.name ?? "this item"}" as dead.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Quantity to mark as dead" error={errors.quantity} required>
          <Input
            id="deadQuantity"
            type="number"
            value={quantity}
            disabled={saving}
            onChange={(e) => {
              setQuantity(e.target.value);
              if (errors.quantity) setErrors(prev => ({ ...prev, quantity: "" }));
            }}
            placeholder={`Available: ${stockItem?.quantity ?? 0}`}
            className={`rounded-xl ${errors.quantity ? "border-red-500" : ""}`}
          />
        </FormField>

        <FormField label="Reason" error={errors.reason} required>
          <Input
            id="deadReason"
            value={reason}
            disabled={saving}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) setErrors(prev => ({ ...prev, reason: "" }));
            }}
            placeholder="e.g., Plant withered, Pest damage"
            className={`rounded-xl ${errors.reason ? "border-red-500" : ""}`}
          />
        </FormField>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-100"
          >
            {saving ? "Marking..." : "Mark as Dead"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
