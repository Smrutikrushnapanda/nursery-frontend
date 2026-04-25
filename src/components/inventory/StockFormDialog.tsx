"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardDialog } from "@/components/common/DashboardDialog";

export type StockVariantOption = {
  id: number;
  label: string;
};

export type StockFormState = {
  variantId: string;
  quantity: string;
  reference: string;
  reason: string;
};

type Props = {
  isOpen: boolean;
  mode: "add" | "edit";
  form: StockFormState;
  saving: boolean;
  variantOptions: StockVariantOption[];
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVariantChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function StockFormDialog({
  isOpen,
  mode,
  form,
  saving,
  variantOptions,
  onClose,
  onInputChange,
  onVariantChange,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Stock" : "Add Stock"}
      description={
        isEdit
          ? "Update the stock quantity for the selected variant."
          : "Add stock against a plant variant."
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="variantId">
            Variant <span className="text-red-500">*</span>
          </Label>
          <select
            id="variantId"
            name="variantId"
            value={form.variantId}
            onChange={(e) => onVariantChange(e.target.value)}
            disabled={isEdit}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">Select variant</option>
            {variantOptions.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={onInputChange}
            placeholder={isEdit ? "e.g., 50" : "e.g., 10"}
            required
            className="rounded-xl"
          />
        </div>

        {isEdit ? (
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reason"
              name="reason"
              value={form.reason}
              onChange={onInputChange}
              placeholder="e.g., Inventory adjustment"
              required
              className="rounded-xl"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="reference">
              Reference <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reference"
              name="reference"
              value={form.reference}
              onChange={onInputChange}
              placeholder="e.g., ORDER-2026-0001"
              required
              className="rounded-xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              saving ||
              !form.variantId ||
              !form.quantity ||
              (isEdit ? !form.reason.trim() : !form.reference.trim())
            }
            className="rounded-xl"
          >
            {saving ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Stock" : "Add Stock"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
