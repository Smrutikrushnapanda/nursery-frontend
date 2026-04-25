import { PlantOption, PlantVariantForm, PlantVariantItem } from "./types";

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return null;
};

export const normalizePlantVariant = (item: any): PlantVariantItem => ({
  id: Number(item?.id ?? 0),
  plantId: Number(item?.plantId ?? item?.plant?.id ?? 0),
  organizationId: item?.organizationId ?? null,
  size: item?.size ?? "MEDIUM",
  price: item?.price ?? 0,
  mockPrice: item?.mockPrice ?? null,
  sku: item?.sku ?? "",
  quantity: item?.quantity ?? null,
  minQuantity: item?.minQuantity ?? null,
  barcode: item?.barcode ?? null,
  status: Boolean(item?.status),
  createdAt: item?.createdAt ?? item?.created_at,
  updatedAt: item?.updatedAt ?? item?.updated_at,
  stockQuantity: toNumber(item?.stockQuantity ?? item?.stock?.quantity) ?? 0,
  stockStatus: item?.stockStatus,
  plant: item?.plant
    ? {
        id: item.plant.id,
        name: item.plant.name,
        scientificName: item.plant.scientificName ?? null,
      }
    : null,
});

export const normalizePlantOption = (item: any): PlantOption => ({
  id: Number(item?.id ?? 0),
  name: item?.name ?? "-",
  scientificName: item?.scientificName ?? null,
});

export const formatVariantDate = (value?: string) => {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getVariantStatus = (item: PlantVariantItem) => {
  if (item.stockStatus) return item.stockStatus;

  const quantity = toNumber(item.stockQuantity ?? item.quantity) ?? 0;
  const minQuantity = toNumber(item.minQuantity) ?? 0;

  if (quantity <= 0) return "Out of Stock";
  if (quantity <= minQuantity) return "Low Stock";
  return "In Stock";
};

export const mapVariantToForm = (item: PlantVariantItem): PlantVariantForm => ({
  plantId: item.plantId ? String(item.plantId) : "",
  size: item.size ?? "MEDIUM",
  price: item.price?.toString?.() ?? "",
  mockPrice: item.mockPrice?.toString?.() ?? "",
  sku: item.sku ?? "",
  quantity: item.quantity?.toString?.() ?? "",
  minQuantity: item.minQuantity?.toString?.() ?? "",
  barcode: item.barcode ?? "",
});

export const buildVariantPayload = (form: PlantVariantForm) => {
  const payload: Record<string, string | number> = {
    plantId: Number(form.plantId),
    size: form.size,
    price: Number(form.price),
  };

  if (form.sku.trim()) payload.sku = form.sku.trim();
  if (form.mockPrice.trim()) payload.mockPrice = Number(form.mockPrice);
  if (form.quantity.trim()) payload.quantity = Number(form.quantity);
  if (form.minQuantity.trim()) payload.minQuantity = Number(form.minQuantity);
  if (form.barcode.trim()) payload.barcode = form.barcode.trim();

  return payload;
};
