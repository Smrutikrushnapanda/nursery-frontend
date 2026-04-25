import { PlantFormState } from "./types";

export const initialForm: PlantFormState = {
  name: "",
  sku: "",
  price: "",
  description: "",
  careInstructions: "",
  waterRequirement: "",
  sunlightRequirement: "",
  temperatureMin: "",
  temperatureMax: "",
  humidityLevel: "",
  soilType: "",
  fertilizingFrequency: "",
  pruningFrequency: "",
  scientificName: "",
  season: "",
  categoryId: "",
  subcategoryId: "",
  petToxicity: "",
  petToxicityNotes: "",
};

export const petToxicityOptions = ["Non-toxic", "Mild", "Moderate", "Severe", "Toxic"];
export const MAX_IMAGE_UPLOADS = 4;

export const basicFields: Array<{
  name: keyof PlantFormState;
  label: string;
  placeholder: string;
  required?: boolean;
}> = [
  { name: "name", label: "Plant Name", placeholder: "e.g., Monstera Deliciosa", required: true },
  { name: "sku", label: "SKU", placeholder: "e.g., PLT-001" },
  { name: "price", label: "Price", placeholder: "e.g., 299" },
  {
    name: "scientificName",
    label: "Scientific Name",
    placeholder: "e.g., Monstera deliciosa",
  },
  { name: "season", label: "Season", placeholder: "e.g., Spring, Summer, Year-round" },
  {
    name: "waterRequirement",
    label: "Water Requirement",
    placeholder: "e.g., Low, Moderate, High",
  },
  {
    name: "sunlightRequirement",
    label: "Sunlight Requirement",
    placeholder: "e.g., Full Sun, Partial Shade",
  },
  { name: "humidityLevel", label: "Humidity Level", placeholder: "e.g., Low, Medium, High" },
  { name: "soilType", label: "Soil Type", placeholder: "e.g., Well-draining soil" },
  {
    name: "fertilizingFrequency",
    label: "Fertilizing Frequency",
    placeholder: "e.g., Monthly",
  },
  { name: "pruningFrequency", label: "Pruning Frequency", placeholder: "e.g., As needed" },
];
