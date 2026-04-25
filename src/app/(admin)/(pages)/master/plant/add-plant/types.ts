export type Category = {
  id: number;
  name: string;
};

export type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

export type PlantFormState = {
  name: string;
  sku: string;
  price: string;
  description: string;
  careInstructions: string;
  waterRequirement: string;
  sunlightRequirement: string;
  temperatureMin: string;
  temperatureMax: string;
  humidityLevel: string;
  soilType: string;
  fertilizingFrequency: string;
  pruningFrequency: string;
  scientificName: string;
  season: string;
  categoryId: string;
  subcategoryId: string;
  petToxicity: string;
  petToxicityNotes: string;
};
