"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { FormField } from "@/components/common/FormField";
import { useState } from "react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.variantId) newErrors.variantId = "Please select a variant";
    if (!form.quantity || Number(form.quantity) < 0) {
      newErrors.quantity = "Enter a valid quantity";
    }
    
    if (isEdit) {
      if (!form.reason.trim()) newErrors.reason = "Reason is required for update";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(e);
    }
  };

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
      <form onSubmit={validate} className="space-y-5">
        <FormField label="Variant" error={errors.variantId} required>
          <select
            id="variantId"
            name="variantId"
            value={form.variantId}
            onChange={(e) => {
              onVariantChange(e.target.value);
              if (errors.variantId) setErrors(prev => ({ ...prev, variantId: "" }));
            }}
            disabled={isEdit}
            className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.variantId ? "border-red-500" : ""}`}
          >
            <option value="">Select variant</option>
            {variantOptions.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Quantity" error={errors.quantity} required>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => {
              onInputChange(e);
              if (errors.quantity) setErrors(prev => ({ ...prev, quantity: "" }));
            }}
            placeholder={isEdit ? "e.g., 50" : "e.g., 10"}
            className={`rounded-xl ${errors.quantity ? "border-red-500" : ""}`}
          />
        </FormField>

        {isEdit ? (
          <FormField label="Reason" error={errors.reason} required>
            <Input
              id="reason"
              name="reason"
              value={form.reason}
              onChange={(e) => {
                onInputChange(e);
                if (errors.reason) setErrors(prev => ({ ...prev, reason: "" }));
              }}
              placeholder="e.g., Inventory adjustment"
              className={`rounded-xl ${errors.reason ? "border-red-500" : ""}`}
            />
          </FormField>
        ) : (
          <FormField label="Reference" error={errors.reference}>
            <Input
              id="reference"
              name="reference"
              value={form.reference}
              onChange={(e) => {
                onInputChange(e);
                if (errors.reference) setErrors(prev => ({ ...prev, reference: "" }));
              }}
              placeholder="e.g., ORDER-2026-0001 (optional)"
              className={`rounded-xl ${errors.reference ? "border-red-500" : ""}`}
            />
          </FormField>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white"
          >
            {saving ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Stock" : "Add Stock"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
