export type PlantMasterVariant = {
  id?: number;
  price?: number | string | null;
  stock?: number | null;
  stockQuantity?: number | null;
  status?: boolean;
};

export type PlantMasterApiItem = {
  id?: number | string;
  name?: string;
  sku?: string;
  scientificName?: string;
  status?: boolean;
  category?: {
    name?: string;
  } | null;
  subcategory?: {
    name?: string;
  } | null;
  variants?: PlantMasterVariant[] | null;
};

export type PlantMasterRow = {
  id: string;
  name: string;
  sku: string;
  scientificName: string;
  category: string;
  subcategory: string;
  variantCount: number;
  totalStock: number;
  lowestPrice: number | null;
  status: "Active" | "Inactive";
};

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return null;
};

export const mapPlantsToMasterRows = (
  plants: PlantMasterApiItem[]
): PlantMasterRow[] =>
  plants.map((plant, index) => {
    const variants = Array.isArray(plant.variants) ? plant.variants : [];
    const stockValues = variants
      .map((variant) => toNumber(variant.stockQuantity ?? variant.stock))
      .filter((value): value is number => value !== null);
    const priceValues = variants
      .map((variant) => toNumber(variant.price))
      .filter((value): value is number => value !== null);

    return {
      id: String(plant.id ?? index + 1),
      name: plant.name ?? "-",
      sku: plant.sku ?? "-",
      scientificName: plant.scientificName ?? "-",
      category: plant.category?.name ?? "-",
      subcategory: plant.subcategory?.name ?? "-",
      variantCount: variants.length,
      totalStock: stockValues.reduce((sum, stock) => sum + stock, 0),
      lowestPrice: priceValues.length > 0 ? Math.min(...priceValues) : null,
      status: plant.status ? "Active" : "Inactive",
    };
  });
