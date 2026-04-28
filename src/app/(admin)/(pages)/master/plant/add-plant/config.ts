import { PlantFormState } from "./types";

export const initialForm: PlantFormState = {
  name: "",
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

export const seasonOptions = ["Spring", "Summer", "Monsoon", "Autumn", "Pre-winter", "Winter", "All"];
export const waterRequirementOptions = ["Low", "Moderate", "High"];
export const sunlightOptions = ["Full Sun", "Partial Sun", "Partial Shade", "Full Shade"];
export const humidityOptions = ["Low", "Moderate", "High"];
export const soilTypeOptions = ["Well-draining", "Loamy", "Sandy", "Clayey", "Peaty", "Chalky"];
export const fertilizingOptions = ["Weekly", "Bi-weekly", "Monthly", "Quarterly", "Annually", "As needed"];
export const pruningOptions = ["Weekly", "Monthly", "Yearly", "As needed"];

export const basicFields: Array<{
  name: keyof PlantFormState;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "select";
  options?: string[];
}> = [
  { name: "name", label: "Plant Name", placeholder: "e.g., Monstera Deliciosa", required: true, type: "text" },
  {
    name: "scientificName",
    label: "Scientific Name",
    placeholder: "e.g., Monstera deliciosa",
    type: "text"
  },
  { 
    name: "season", 
    label: "Season", 
    placeholder: "Select season", 
    type: "select", 
    options: seasonOptions 
  },
  {
    name: "waterRequirement",
    label: "Water Requirement",
    placeholder: "Select requirement",
    type: "select",
    options: waterRequirementOptions
  },
  {
    name: "sunlightRequirement",
    label: "Sunlight Requirement",
    placeholder: "Select sunlight",
    type: "select",
    options: sunlightOptions
  },
  { 
    name: "humidityLevel", 
    label: "Humidity Level", 
    placeholder: "Select humidity", 
    type: "select", 
    options: humidityOptions 
  },
  { 
    name: "soilType", 
    label: "Soil Type", 
    placeholder: "Select soil type", 
    type: "select", 
    options: soilTypeOptions 
  },
  {
    name: "fertilizingFrequency",
    label: "Fertilizing Frequency",
    placeholder: "Select frequency",
    type: "select",
    options: fertilizingOptions
  },
  { 
    name: "pruningFrequency", 
    label: "Pruning Frequency", 
    placeholder: "Select frequency", 
    type: "select", 
    options: pruningOptions 
  },
];
