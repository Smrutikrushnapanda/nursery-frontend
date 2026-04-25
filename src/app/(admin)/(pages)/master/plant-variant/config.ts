import { PlantVariantForm } from "./types";

export const initialForm: PlantVariantForm = {
  plantId: "",
  size: "MEDIUM",
  price: "",
  mockPrice: "",
  sku: "",
  quantity: "",
  minQuantity: "",
  barcode: "",
};

export const sizeOptions = [
  "TINY",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
];
