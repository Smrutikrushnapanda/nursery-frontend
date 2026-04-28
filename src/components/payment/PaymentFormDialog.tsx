"use client";

import React, { useState, useEffect } from "react";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { billingApis } from "@/utils/api/api";
import { FormField } from "@/components/common/FormField";

export interface PaymentFormItem {
  plantId: string;
  variantId: string;
  quantity: string;
  unitPrice: string;
}

export interface PaymentFormState {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: "CASH" | "UPI" | "DEBIT_CARD" | "CREDIT_CARD";
  paymentReference: string;
  items: PaymentFormItem[];
}

const initialItem: PaymentFormItem = {
  plantId: "",
  variantId: "",
  quantity: "1",
  unitPrice: "",
};

const generateRef = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `MNL-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const initialForm: PaymentFormState = {
  customerName: "Walk-in Customer",
  customerPhone: "",
  customerEmail: "",
  paymentMethod: "CASH",
  paymentReference: generateRef(),
  items: [{ ...initialItem }],
};

const selectClass =
  "w-full h-9 rounded-md border border-input bg-white px-2.5 py-1.5 text-sm shadow-xs outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m2%204%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormState) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export function PaymentForm({ onSubmit, onCancel, saving }: PaymentFormProps) {
  const [form, setForm] = useState<PaymentFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [plants, setPlants] = useState<any[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [variantsMap, setVariantsMap] = useState<Record<number, any[]>>({});
  const [loadingVariants, setLoadingVariants] = useState<Record<number, boolean>>({});
  const fetchedVariantsRef = React.useRef<Set<number>>(new Set());

  useEffect(() => {
    setForm({ ...initialForm, paymentReference: generateRef() });
    setVariantsMap({});
    setLoadingVariants({});
    setErrors({});
    fetchedVariantsRef.current = new Set();
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    setIsLoadingPlants(true);
    try {
      const res = await billingApis.getActivePlants();
      let data: any[] = [];
      if (Array.isArray(res)) data = res;
      else if (res && Array.isArray(res.data)) data = res.data;
      else if (res && res.data && Array.isArray(res.data.data)) data = res.data.data;
      setPlants(data);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    } finally {
      setIsLoadingPlants(false);
    }
  };

  const handlePlantChange = async (index: number, plantId: string) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], plantId, variantId: "", unitPrice: "" };
    setForm((prev) => ({ ...prev, items: newItems }));

    // Clear error for this plant field
    if (errors[`items.${index}.plantId`]) {
      const newErrors = { ...errors };
      delete newErrors[`items.${index}.plantId`];
      setErrors(newErrors);
    }

    const numericId = Number(plantId);
    if (!numericId || fetchedVariantsRef.current.has(numericId)) return;

    fetchedVariantsRef.current.add(numericId);
    setLoadingVariants((prev) => ({ ...prev, [numericId]: true }));
    try {
      const res = await billingApis.getPlantVariant(numericId);
      let data: any[] = [];
      if (Array.isArray(res)) data = res;
      else if (res && res.data && Array.isArray(res.data.variants)) data = res.data.variants;
      else if (res && Array.isArray(res.data)) data = res.data;
      else if (res && res.data && Array.isArray(res.data.data)) data = res.data.data;
      else if (res && Array.isArray(res.variants)) data = res.variants;
      setVariantsMap((prev) => ({ ...prev, [numericId]: data }));
    } catch (error) {
      console.error(`Failed to fetch variants for plant ${numericId}:`, error);
      fetchedVariantsRef.current.delete(numericId);
    } finally {
      setLoadingVariants((prev) => ({ ...prev, [numericId]: false }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!form.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.customerPhone)) {
      newErrors.customerPhone = "Enter a valid 10-digit phone number";
    }

    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      newErrors.customerEmail = "Enter a valid email address";
    }

    form.items.forEach((item, index) => {
      if (!item.plantId) newErrors[`items.${index}.plantId`] = "Plant is required";
      if (!item.variantId) newErrors[`items.${index}.variantId`] = "Variant is required";
      if (!item.quantity || Number(item.quantity) <= 0) {
        newErrors[`items.${index}.quantity`] = "Required";
      }
      if (!item.unitPrice || Number(item.unitPrice) < 0) {
        newErrors[`items.${index}.unitPrice`] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(form);
    }
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...initialItem }] }));
  };

  const removeItem = (index: number) => {
    if (form.items.length === 1) return;
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    // Clear errors for removed item (simplified: just re-validate if needed or let it be)
  };

  const updateItem = (index: number, updates: Partial<PaymentFormItem>) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], ...updates };

    // Auto-fill price if variant is changed
    if (updates.variantId) {
      const variants = variantsMap[Number(newItems[index].plantId)];
      const plantVariants = Array.isArray(variants) ? variants : [];
      const variant = plantVariants.find((v: any) => v.id?.toString() === updates.variantId);
      if (variant) {
        newItems[index].unitPrice = (variant.defaultPrice ?? variant.price)?.toString() || "";
      }
    }

    // Clear error for updated field
    const fieldKey = Object.keys(updates)[0];
    if (errors[`items.${index}.${fieldKey}`]) {
      const newErrors = { ...errors };
      delete newErrors[`items.${index}.${fieldKey}`];
      setErrors(newErrors);
    }

    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const totalPrice = form.items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Manual Bill</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Record a direct sale with customer and item details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
          <FormField label="Customer Name" error={errors.customerName} required>
            <Input
              placeholder="Full Name"
              value={form.customerName}
              onChange={(e) => {
                setForm({ ...form, customerName: e.target.value });
                if (errors.customerName) setErrors(prev => {
                   const {customerName, ...rest} = prev;
                   return rest;
                });
              }}
              className={errors.customerName ? "border-red-500" : "bg-white dark:bg-gray-900"}
            />
          </FormField>
          <FormField label="Phone Number" error={errors.customerPhone} required>
            <Input
              placeholder="10-digit mobile"
              value={form.customerPhone}
              onChange={(e) => {
                setForm({ ...form, customerPhone: e.target.value });
                if (errors.customerPhone) setErrors(prev => {
                  const {customerPhone, ...rest} = prev;
                  return rest;
                });
              }}
              className={errors.customerPhone ? "border-red-500" : "bg-white dark:bg-gray-900"}
            />
          </FormField>
          <FormField label="Email (Optional)" error={errors.customerEmail}>
            <Input
              type="email"
              placeholder="email@example.com"
              value={form.customerEmail}
              onChange={(e) => {
                setForm({ ...form, customerEmail: e.target.value });
                if (errors.customerEmail) setErrors(prev => {
                  const {customerEmail, ...rest} = prev;
                  return rest;
                });
              }}
              className={errors.customerEmail ? "border-red-500" : "bg-white dark:bg-gray-900"}
            />
          </FormField>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Payment Method" required>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
              className={selectClass}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="CREDIT_CARD">Credit Card</option>
            </select>
          </FormField>
          <FormField label="Payment Reference">
            <Input
              value={form.paymentReference}
              readOnly
              className="bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-default font-mono text-xs border-dashed"
            />
          </FormField>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="h-8 border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/20"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {form.items.map((item, index) => {
              const plantId = Number(item.plantId);
              const itemVariants = Array.isArray(variantsMap[plantId]) ? variantsMap[plantId] : [];
              const isVarLoading = loadingVariants[plantId];

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-start group animate-in fade-in slide-in-from-top-1 duration-200 bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800"
                >
                  {/* Plant */}
                  <div className="col-span-12 sm:col-span-4">
                    <FormField label={index === 0 ? "Plant" : ""} error={errors[`items.${index}.plantId`]} required>
                      <select
                        value={item.plantId}
                        disabled={isLoadingPlants}
                        onChange={(e) => handlePlantChange(index, e.target.value)}
                        className={`${selectClass} ${errors[`items.${index}.plantId`] ? "border-red-500" : ""}`}
                      >
                        <option value="">
                          {isLoadingPlants ? "Loading..." : "Select Plant"}
                        </option>
                        {plants.map((p) => (
                          <option key={p.id} value={p.id.toString()}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Variant */}
                  <div className="col-span-12 sm:col-span-3">
                    <FormField label={index === 0 ? "Variant" : ""} error={errors[`items.${index}.variantId`]} required>
                      <select
                        value={item.variantId}
                        disabled={!item.plantId || isVarLoading}
                        onChange={(e) => updateItem(index, { variantId: e.target.value })}
                        className={`${selectClass} ${errors[`items.${index}.variantId`] ? "border-red-500" : ""}`}
                      >
                        <option value="">
                          {isVarLoading
                            ? "Loading..."
                            : item.plantId
                            ? "Select Size"
                            : "Pick Plant"}
                        </option>
                        {itemVariants.map((v: any) => (
                          <option key={v.id} value={v.id?.toString() || ""}>
                            {(v.size || v.name || v.sku || "N/A")
                              .toString()
                              .replace("_", " ")}{" "}
                            - ₹{v.defaultPrice ?? v.price ?? 0}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Qty */}
                  <div className="col-span-5 sm:col-span-2">
                    <FormField label={index === 0 ? "Qty" : ""} error={errors[`items.${index}.quantity`]} required>
                      <Input
                        type="number"
                        min="1"
                        max="9999"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length <= 4) {
                            updateItem(index, { quantity: val });
                          }
                        }}
                        className={errors[`items.${index}.quantity`] ? "border-red-500" : "bg-white dark:bg-gray-900"}
                      />
                    </FormField>
                  </div>

                  {/* Price */}
                  <div className="col-span-5 sm:col-span-2">
                    <FormField label={index === 0 ? "Price" : ""} error={errors[`items.${index}.unitPrice`]} required>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                        className={errors[`items.${index}.unitPrice`] ? "border-red-500" : "bg-white dark:bg-gray-900"}
                        placeholder="0"
                      />
                    </FormField>
                  </div>

                  {/* Delete */}
                  <div className={`col-span-2 sm:col-span-1 flex justify-center ${index === 0 ? "pt-7" : "pt-2"}`}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length === 1}
                      className="h-9 w-9 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary and Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Total Bill Amount:</span>
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 sm:flex-none"
            >
              Reset Form
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 sm:flex-none px-8 bg-brand-500 hover:bg-brand-600 text-white">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Create Bill"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface PaymentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormState) => Promise<void>;
  saving: boolean;
}

export function PaymentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  saving,
}: PaymentFormDialogProps) {
  if (!isOpen) return null;

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Manual Bill"
      description="Record a direct sale with customer and item details."
      className="max-w-2xl p-0"
    >
      <PaymentForm onSubmit={onSubmit} onCancel={onClose} saving={saving} />
    </DashboardDialog>
  );
}
