"use client";

import { useState, useEffect } from "react";
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
import { Sprout } from "lucide-react";

// Mock data types
type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

// 🌿 Dummy data for development
const DUMMY_CATEGORIES: Category[] = [
  { id: 1, name: "Indoor Plants" },
  { id: 2, name: "Outdoor Plants" },
  { id: 3, name: "Succulents & Cacti" },
  { id: 4, name: "Flowering Plants" },
  { id: 5, name: "Herbs & Vegetables" },
];

const DUMMY_SUBCATEGORIES: Subcategory[] = [
  // Indoor Plants
  { id: 101, name: "Low Light", categoryId: 1 },
  { id: 102, name: "Air Purifying", categoryId: 1 },
  { id: 103, name: "Pet-Friendly", categoryId: 1 },
  { id: 104, name: "Trailing & Hanging", categoryId: 1 },
  // Outdoor Plants
  { id: 201, name: "Shrubs", categoryId: 2 },
  { id: 202, name: "Trees", categoryId: 2 },
  { id: 203, name: "Climbers", categoryId: 2 },
  { id: 204, name: "Ground Cover", categoryId: 2 },
  // Succulents & Cacti
  { id: 301, name: "Echeveria", categoryId: 3 },
  { id: 302, name: "Aloe", categoryId: 3 },
  { id: 303, name: "Cactus", categoryId: 3 },
  { id: 304, name: "Haworthia", categoryId: 3 },
  // Flowering Plants
  { id: 401, name: "Orchids", categoryId: 4 },
  { id: 402, name: "Roses", categoryId: 4 },
  { id: 403, name: "Lilies", categoryId: 4 },
  { id: 404, name: "Annuals", categoryId: 4 },
  // Herbs & Vegetables
  { id: 501, name: "Culinary Herbs", categoryId: 5 },
  { id: 502, name: "Leafy Greens", categoryId: 5 },
  { id: 503, name: "Root Vegetables", categoryId: 5 },
  { id: 504, name: "Fruiting Vegetables", categoryId: 5 },
];

export default function AddPlantPage() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    imageUrl: "",
    careInstructions: "",
    season: "",
    categoryId: "",
    subcategoryId: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);

  // Fetch categories & subcategories with fallback to dummy data
  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await fetch("/api/categories");
        const subRes = await fetch("/api/subcategories");
        
        if (!catRes.ok || !subRes.ok) {
          throw new Error("API not available");
        }
        
        const catData = await catRes.json();
        const subData = await subRes.json();
        setCategories(catData);
        setSubcategories(subData);
        setUseDummyData(false);
      } catch (err) {
        console.log("Using dummy data for development");
        setCategories(DUMMY_CATEGORIES);
        setSubcategories(DUMMY_SUBCATEGORIES);
        setUseDummyData(true);
      }
    }
    fetchData();
  }, []);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (!form.categoryId) {
      setFilteredSubcategories([]);
      return;
    }
    const filtered = subcategories.filter(
      (sub) => sub.categoryId === Number(form.categoryId)
    );
    setFilteredSubcategories(filtered);
    // Reset subcategory when category changes
    setForm((prev) => ({ ...prev, subcategoryId: "" }));
  }, [form.categoryId, subcategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      subcategoryId: Number(form.subcategoryId),
    };

    try {
      // In development with dummy data, just log and simulate success
      if (useDummyData) {
        console.log("Submitting with dummy data:", payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Plant added successfully! (Demo mode)");
        // Optionally reset form
        setForm({
          name: "",
          sku: "",
          description: "",
          imageUrl: "",
          careInstructions: "",
          season: "",
          categoryId: "",
          subcategoryId: "",
        });
      } else {
        const res = await fetch("/api/plants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log("SUCCESS:", data);
        alert("Plant added successfully!");
      }
    } catch (err) {
      console.error("ERROR:", err);
      alert("Failed to add plant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-theme-md transition-all duration-500 hover:shadow-theme-xl">
        {/* Premium border layers */}
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-200/40" />
        <div className="absolute inset-0.5 rounded-xl border border-brand-200/60" />
        
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 rounded-t-2xl" />
        
        {/* Subtle background gradient */}
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
            {useDummyData && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                Demo Mode
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Two-column grid for basic info */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Plant Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Monstera Deliciosa"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="e.g., PLT-001"
                  value={form.sku}
                  onChange={handleInputChange}
                  required
                  className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the plant's appearance, origin, etc."
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://example.com/plant-image.jpg"
                value={form.imageUrl}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            {/* Care Instructions */}
            <div className="space-y-2">
              <Label htmlFor="careInstructions" className="text-sm font-medium text-gray-700">
                Care Instructions
              </Label>
              <Textarea
                id="careInstructions"
                name="careInstructions"
                placeholder="Watering, sunlight, soil type, etc."
                value={form.careInstructions}
                onChange={handleInputChange}
                rows={3}
                className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label htmlFor="season" className="text-sm font-medium text-gray-700">
                Growing Season
              </Label>
              <Input
                id="season"
                name="season"
                placeholder="e.g., Spring, Summer, Year-round"
                value={form.season}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
              />
            </div>

            {/* Category & Subcategory using shadcn Select */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                  required
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg max-h-60">
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
                <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">
                  Subcategory <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.subcategoryId}
                  onValueChange={(value) => handleSelectChange("subcategoryId", value)}
                  disabled={!form.categoryId}
                  required
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50">
                    <SelectValue placeholder={form.categoryId ? "Select a subcategory" : "Select a category first"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg max-h-60">
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 text-base font-semibold text-white shadow-md transition-all hover:from-brand-600 hover:to-brand-500 hover:shadow-lg disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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