"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { masterApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { useRouter } from "next/navigation";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { getCategories, getSubCategories, createPlant } = masterApis;
  const { plants, setPlants } = useAppStore();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
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
    } catch (error: any) {
      console.log(error);
      alert(error?.message);
    } finally {
      setLoading(false);
    }
  };

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

        <AddPlantHeader />

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
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
