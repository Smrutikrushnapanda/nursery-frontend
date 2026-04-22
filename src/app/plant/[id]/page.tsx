"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductMainSection } from "./ProductMainSection";
import { masterApis } from "@/utils/api/api";
import { Plant } from "@/types";
import { Link } from "lucide-react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const normalizeImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (!backendUrl) {
    return imageUrl;
  }

  try {
    return new URL(imageUrl, backendUrl).toString();
  } catch {
    return imageUrl;
  }
};

export default function PlantDetailsPage() {
  const params = useParams();
  const plantId = params.id as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlantData = async () => {
      if (!plantId) return;
      
      // Validate that plantId is a valid number
      const numericId = Number(plantId);
      
      if (isNaN(numericId) || numericId <= 0) {
        setError("Invalid plant ID");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching plant with ID:', numericId);
        const response = await masterApis.getPlantById(numericId);
        console.log('API Response:', response);
        
        if (response.success) {
          setPlant(response.data);
        } else {
          setError("Failed to load plant data");
        }
      } catch (err: any) {
        console.error("Error fetching plant:", err);
        setError(err?.message || "Failed to load plant data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Plant not found"}</p>
          <Link href="/plants" className="mt-4 inline-block text-brand-600 hover:text-brand-700">
            Back to Plants
          </Link>
        </div>
      </div>
    );
  }


  const lowestPrice = plant.variants?.length
    ? Math.min(...plant.variants.map((v) => v.price))
    : null;
  const totalStock = plant.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const normalizedImages = (plant.images || []).map((image, index) => ({
    ...image,
    id: image?.id ?? index,
    imageUrl: normalizeImageUrl(image?.imageUrl),
  }));

  const handleAddToCart = async (quantity: number, variantId: number | null) => {
    console.log("Add to cart:", { plantId: plant.id, variantId, quantity });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Added to cart!");
  };



  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 ">
        {/* Main Section */}
        <ProductMainSection
          name={plant.name}
          scientificName={plant.scientificName}
          description={plant.description}
          sku={plant.sku}
          imageUrl={normalizeImageUrl(plant.imageUrl)}
          images={normalizedImages}
          variants={plant.variants || []}
          category={plant.category}
          subcategory={plant.subcategory}
          lowestPrice={lowestPrice}
          totalStock={totalStock}
          waterRequirement={plant.waterRequirement}
          sunlightRequirement={plant.sunlightRequirement}
          temperatureMin={plant.temperatureMin}
          temperatureMax={plant.temperatureMax}
          humidityLevel={plant.humidityLevel}
          soilType={plant.soilType}
          pruningFrequency={plant.pruningFrequency}
          season={plant.season}
          fertilizingFrequency={plant.fertilizingFrequency}
          petToxicity={plant.petToxicity}
          careInstructions={plant.careInstructions}
          isLoggedIn={isLoggedIn}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
