"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { masterApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { initialForm, MAX_IMAGE_UPLOADS } from "./config";
import { Category, PlantFormState, Subcategory } from "./types";
import { AddPlantHeader } from "@/components/plant/AddPlantHeader";
import { AddPlantSubmitButton } from "@/components/plant/AddPlantSubmitButton";
import { CategoryFields } from "@/components/plant/CategoryFields";
import { PlantTextFields } from "@/components/plant/PlantTextFields";
import { TemperatureRangeFields } from "@/components/plant/TemperatureRangeFields";
import { PlantTextareas } from "@/components/plant/PlantTextareas";
import { PetToxicityField } from "@/components/plant/PetToxicityField";
import { ImageUploadField } from "@/components/plant/ImageUploadField";
import { TableLoader } from "@/components/table-loader/table-loader";

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

export default function AddPlantPage() {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<PlantFormState>(initialForm);
  const [originalForm, setOriginalForm] = useState<PlantFormState | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const { getCategories, getSubCategories, createPlant, updatePlant, getPlantById } = masterApis;
  const { plants, setPlants } = useAppStore();

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        const rawData = response.data;
        const categoriesList = Array.isArray(rawData) 
          ? rawData 
          : Array.isArray(rawData?.data) 
            ? rawData.data 
            : [];
        setCategories(categoriesList.map(normalizeCategory));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubcategories = async () => {
    if (!form.categoryId) {
      setSubcategories([]);
      return;
    }

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
    }
  };

  const fetchPlantForEdit = async () => {
    if (!editId) return;

    setPageLoading(true);
    try {
      const response = await getPlantById(Number(editId));
      if (response.success) {
        const plant = response.data?.data || response.data;

        const editForm: PlantFormState = {
          name: plant.name ?? "",
          sku: plant.sku ?? "",
          price: plant.price?.toString() ?? "",
          description: plant.description ?? "",
          careInstructions: plant.careInstructions ?? "",
          waterRequirement: plant.waterRequirement ?? "",
          sunlightRequirement: plant.sunlightRequirement ?? "",
          temperatureMin: plant.temperatureMin?.toString() ?? "",
          temperatureMax: plant.temperatureMax?.toString() ?? "",
          humidityLevel: plant.humidityLevel ?? "",
          soilType: plant.soilType ?? "",
          fertilizingFrequency: plant.fertilizingFrequency ?? "",
          pruningFrequency: plant.pruningFrequency ?? "",
          scientificName: plant.scientificName ?? "",
          season: plant.season ?? "",
          categoryId: plant.categoryId?.toString() ?? plant.category?.id?.toString() ?? "",
          subcategoryId: plant.subcategoryId?.toString() ?? plant.subcategory?.id?.toString() ?? "",
          petToxicity: plant.petToxicity ?? "",
          petToxicityNotes: plant.petToxicityNotes ?? "",
        };

        setForm(editForm);
        setOriginalForm(editForm);
      }
    } catch (error: any) {
      console.error("Failed to fetch plant:", error);
      alert(error?.message || "Failed to load plant data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetchPlantForEdit();
    }
  }, [editId]);

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

  const handleSelectChange = (
    name: "categoryId" | "subcategoryId" | "petToxicity",
    value: string
  ) => {
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
    setForm((prev) => {
      const numericValue = Number(value);
      const nextForm = { ...prev, [name]: value };

      if (name === "temperatureMin" && prev.temperatureMax && numericValue > Number(prev.temperatureMax)) {
        nextForm.temperatureMax = value;
      }

      if (name === "temperatureMax" && prev.temperatureMin && numericValue < Number(prev.temperatureMin)) {
        nextForm.temperatureMin = value;
      }

      return nextForm;
    });
  };

  const syncImageInput = (files: File[]) => {
    if (!imageInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    imageInputRef.current.files = dataTransfer.files;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    setImageFiles((prev) => {
      const updatedFiles = [...prev, ...selectedFiles].slice(0, MAX_IMAGE_UPLOADS);
      syncImageInput(updatedFiles);
      return updatedFiles;
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => {
      const updatedFiles = prev.filter((_, index) => index !== indexToRemove);
      syncImageInput(updatedFiles);
      return updatedFiles;
    });
  };

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

  const buildEditPayload = () => {
    if (!originalForm) return {};

    const changed: Record<string, any> = {};
    for (const key of Object.keys(form) as (keyof PlantFormState)[]) {
      if (form[key] !== originalForm[key]) {
        changed[key] = form[key];
      }
    }

    return changed;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && editId) {
        const changedFields = buildEditPayload();

        if (Object.keys(changedFields).length === 0) {
          alert("No changes detected");
          setLoading(false);
          return;
        }

        const response = await updatePlant(Number(editId), changedFields);
        if (response.success) {
          router.push("/master/plant");
        }
      } else {
        const response = await createPlant(buildPayload());
        if (response.success) {
          setPlants({ ...plants, ...response.data });
          setForm(initialForm);
          setImageFiles([]);
          setSubcategories([]);
          setFilteredSubcategories([]);
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      alert(error?.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <TableLoader message="Loading plant data..." />;
  }

  return (
    <div className="mx-auto px-4">
      <button className="mb-5 cursor-pointer text-primary" onClick={() => router.back()}>
        &larr; Back
      </button>
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-theme-md transition-all duration-500 hover:shadow-theme-xl">
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-200/40" />
        <div className="absolute inset-0.5 rounded-xl border border-brand-200/60" />
        <div className="absolute left-0 right-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-25/30 via-transparent to-blue-light-25/20" />

        <AddPlantHeader isEdit={isEdit} />

        <CardContent className="relative pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <PlantTextFields form={form} onChange={handleInputChange} />
            <TemperatureRangeFields
              temperatureMin={form.temperatureMin}
              temperatureMax={form.temperatureMax}
              onChange={handleTemperatureChange}
            />
            <CategoryFields
              categoryId={form.categoryId}
              subcategoryId={form.subcategoryId}
              categories={categories}
              subcategories={filteredSubcategories}
              loading={loading}
              onSelectChange={handleSelectChange}
            />
            <PlantTextareas form={form} onChange={handleInputChange} />
            <PetToxicityField value={form.petToxicity} onChange={handleSelectChange} />
            <ImageUploadField
              inputRef={imageInputRef}
              imageFiles={imageFiles}
              imagePreviews={imagePreviews}
              maxUploads={MAX_IMAGE_UPLOADS}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
            <AddPlantSubmitButton
              loading={loading}
              disabled={loading || !form.name || !form.categoryId || !form.subcategoryId}
              isEdit={isEdit}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
