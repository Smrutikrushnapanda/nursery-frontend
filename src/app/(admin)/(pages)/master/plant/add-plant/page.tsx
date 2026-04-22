"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, X } from "lucide-react";
import { masterApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

type PlantFormState = {
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

const initialForm: PlantFormState = {
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

const petToxicityOptions = ["Non-toxic", "Mild", "Moderate", "Severe", "Toxic"];
const MAX_IMAGE_UPLOADS = 4;

const normalizeCategory = (item: any): Category => ({
  id: Number(item?.id),
  name: item?.name ?? item?.categoryName ?? "",
});

const normalizeSubcategory = (item: any, selectedCategoryId?: number): Subcategory => ({
  id: Number(item?.id),
  name: item?.name ?? item?.subcategoryName ?? "",
  categoryId: Number(
    item?.categoryId ??
      item?.category?.id ??
      item?.category_id ??
      selectedCategoryId ??
      0
  ),
});

const basicFields: Array<{
  name: keyof PlantFormState;
  label: string;
  placeholder: string;
  required?: boolean;
}> = [
  { name: "name", label: "Plant Name", placeholder: "e.g., Monstera Deliciosa", required: true },
  { name: "sku", label: "SKU", placeholder: "e.g., PLT-001" },
  { name: "price", label: "Price", placeholder: "e.g., 299" },
  { name: "scientificName", label: "Scientific Name", placeholder: "e.g., Monstera deliciosa" },
  { name: "season", label: "Season", placeholder: "e.g., Spring, Summer, Year-round" },
  { name: "waterRequirement", label: "Water Requirement", placeholder: "e.g., Low, Moderate, High" },
  { name: "sunlightRequirement", label: "Sunlight Requirement", placeholder: "e.g., Full Sun, Partial Shade" },
  { name: "humidityLevel", label: "Humidity Level", placeholder: "e.g., Low, Medium, High" },
  { name: "soilType", label: "Soil Type", placeholder: "e.g., Well-draining soil" },
  { name: "fertilizingFrequency", label: "Fertilizing Frequency", placeholder: "e.g., Monthly" },
  { name: "pruningFrequency", label: "Pruning Frequency", placeholder: "e.g., As needed" },
];

export default function AddPlantPage() {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<PlantFormState>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { getCategories, getSubCategories, createPlant } = masterApis;
  const {plants,setPlants} = useAppStore();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories((response.data ?? []).map(normalizeCategory));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    if (!form.categoryId) {
      setSubcategories([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getSubCategories(Number(form.categoryId));
      if (response.success) {
        setSubcategories(
          (response.data ?? []).map((item: any) =>
            normalizeSubcategory(item, Number(form.categoryId))
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [form.categoryId]);

  useEffect(() => {
    if (!form.categoryId) {
      setFilteredSubcategories([]);
      return;
    }
    setFilteredSubcategories(subcategories);
  }, [form.categoryId, subcategories]);

  useEffect(() => {
    if (imageFiles.length === 0) {
      setImagePreviews([]);
      return;
    }

    const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: keyof PlantFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
    }));
  };

  const handleTemperatureChange = (
    name: "temperatureMin" | "temperatureMax",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    setImageFiles((prev) => {
      const updatedFiles = [...prev, ...selectedFiles].slice(0, MAX_IMAGE_UPLOADS);

      if (imageInputRef.current) {
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        imageInputRef.current.files = dataTransfer.files;
      }

      return updatedFiles;
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => {
      const updatedFiles = prev.filter((_, index) => index !== indexToRemove);

      if (imageInputRef.current) {
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        imageInputRef.current.files = dataTransfer.files;
      }

      return updatedFiles;
    });
  };

  const selectedCategoryName =
    categories.find((category) => category.id.toString() === form.categoryId)?.name ?? "";

  const selectedSubcategoryName =
    filteredSubcategories.find(
      (subcategory) => subcategory.id.toString() === form.subcategoryId
    )?.name ?? "";

  const buildPayload = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "") {
        formData.append(key, value);
      }
    });

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    return formData;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createPlant(buildPayload());
      if (response.success) {
        console.log(response.data);
        setPlants({...plants, ...response.data});
        setForm(initialForm);
        setImageFiles([]);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      console.log(error);
      alert(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4">
      <button className="mb-5 text-primary cursor-pointer"
        onClick={()=> router.back()}
      >
        &larr; Back
      </button>
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-theme-md transition-all duration-500 hover:shadow-theme-xl">
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-200/40" />
        <div className="absolute inset-0.5 rounded-xl border border-brand-200/60" />
        <div className="absolute left-0 right-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-25/30 via-transparent to-blue-light-25/20" />

        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 shadow-md">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-brand-800">
                  Add New Plant
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Fill in the details to add a plant to your inventory
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {basicFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.name === "price" ? "number" : "text"}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleInputChange}
                    required={field.required}
                    min={field.name === "price" ? "0" : undefined}
                    step={field.name === "price" ? "0.01" : undefined}
                    className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperatureMin" className="text-sm font-medium text-gray-700">
                    Temperature Min
                  </Label>
                  <span className="text-sm font-semibold text-brand-700">
                    {form.temperatureMin || "0"}°C
                  </span>
                </div>
                <input
                  id="temperatureMin"
                  name="temperatureMin"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={form.temperatureMin || "0"}
                  onChange={(e) => handleTemperatureChange("temperatureMin", e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-brand-100 accent-brand-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0°C</span>
                  <span>50°C</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperatureMax" className="text-sm font-medium text-gray-700">
                    Temperature Max
                  </Label>
                  <span className="text-sm font-semibold text-brand-700">
                    {form.temperatureMax || "0"}°C
                  </span>
                </div>
                <input
                  id="temperatureMax"
                  name="temperatureMax"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={form.temperatureMax || "0"}
                  onChange={(e) => handleTemperatureChange("temperatureMax", e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-brand-100 accent-brand-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0°C</span>
                  <span>50°C</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20">
                    <SelectValue placeholder="Select category">
                      {selectedCategoryName || undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id.toString()}
                        className="cursor-pointer transition-colors hover:bg-brand-25 focus:bg-brand-25"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategoryId" className="text-sm font-medium text-gray-700">
                  Subcategory <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.subcategoryId}
                  onValueChange={(value) => handleSelectChange("subcategoryId", value)}
                  disabled={loading || !form.categoryId}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50">
                    <SelectValue placeholder="Select subcategory">
                      {selectedSubcategoryName || undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
                    {filteredSubcategories.map((sub) => (
                      <SelectItem
                        key={sub.id}
                        value={sub.id.toString()}
                        className="cursor-pointer transition-colors hover:bg-brand-25 focus:bg-brand-25"
                      >
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the plant"
                rows={4}
                value={form.description}
                onChange={handleInputChange}
                className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="careInstructions" className="text-sm font-medium text-gray-700">
                Care Instructions
              </Label>
              <Textarea
                id="careInstructions"
                name="careInstructions"
                placeholder="Watering, placement, maintenance, and other care instructions"
                rows={4}
                value={form.careInstructions}
                onChange={handleInputChange}
                className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petToxicity" className="text-sm font-medium text-gray-700">
                Pet Toxicity
              </Label>
              <Select
                value={form.petToxicity}
                onValueChange={(value) => handleSelectChange("petToxicity", value)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20">
                  <SelectValue placeholder="Select pet toxicity level" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
                  {petToxicityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="petToxicityNotes" className="text-sm font-medium text-gray-700">
                Pet Toxicity Notes
              </Label>
              <Textarea
                id="petToxicityNotes"
                name="petToxicityNotes"
                placeholder="Add notes like safe for cats, toxic if ingested, etc."
                rows={3}
                value={form.petToxicityNotes}
                onChange={handleInputChange}
                className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                Images
              </Label>
              <Input
                ref={imageInputRef}
                id="images"
                name="images"
                type="file"
                accept="image/*"
                maxLength={4}
                multiple
                onChange={handleImageChange}
                className="h-auto rounded-xl border-2 border-brand-200 bg-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
              <p className="text-xs text-gray-500">
                You can upload up to 4 images. The first uploaded image will be treated as primary.
              </p>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative overflow-hidden rounded-xl border border-brand-200 bg-gray-50"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />
                      <p className="truncate px-3 py-2 text-xs text-gray-500">
                        {imageFiles[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  loading || !form.name || !form.categoryId || !form.subcategoryId
                }
                className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 text-base font-semibold text-white shadow-md transition-all hover:from-brand-600 hover:to-brand-500 hover:shadow-lg disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Adding Plant...
                    </>
                  ) : (
                    <>
                      <Sprout className="h-5 w-5" />
                      Add Plant
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
