export type PlantVariantItem = {
  id: number;
  plantId: number;
  organizationId?: string | null;
  size: string;
  price: number | string;
  mockPrice?: number | string | null;
  sku: string;
  quantity?: number | string | null;
  minQuantity?: number | string | null;
  barcode?: string | null;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  stockQuantity?: number | null;
  stockStatus?: "In Stock" | "Low Stock" | "Out of Stock" | string;
  plant?: {
    id?: number;
    name?: string;
    scientificName?: string | null;
  } | null;
};

export type PlantVariantForm = {
  plantId: string;
  size: string;
  price: string;
  mockPrice: string;
  sku: string;
  quantity: string;
  minQuantity: string;
  barcode: string;
};

export type PlantOption = {
  id: number;
  name: string;
  scientificName?: string | null;
};
