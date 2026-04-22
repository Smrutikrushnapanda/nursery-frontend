"use client";

import { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
  AlertCircle,
} from "lucide-react";

type GalleryImage = { id: number; imageUrl: string };
type Variant = {
  id: number;
  name: string;
  size?: string;
  price: number | string;
  stock: number;
  compareAtPrice?: number;
};
type Category = { id: number; name: string };

const getVariantLabel = (variant: Variant) => variant.size || variant.name;

const getVariantPrice = (price: number | string) =>
  typeof price === "string" ? parseFloat(price) : price;

interface ProductMainSectionProps {
  name: string;
  scientificName?: string;
  description: string;
  sku?: string;
  imageUrl?: string;
  images: GalleryImage[];
  variants: Variant[];
  category?: Category;
  subcategory?: Category;
  lowestPrice: number | null;
  totalStock: number;
  waterRequirement?: string;
  sunlightRequirement?: string;
  temperatureMin?: number;
  temperatureMax?: number;
  humidityLevel?: string;
  soilType?: string;
  pruningFrequency?: string;
  season?: string;
  fertilizingFrequency?: string;
  petToxicity?: string;
  careInstructions?: string;
  isLoggedIn: boolean;
  onAddToCart: (quantity: number, variantId: number | null) => void;
  onWishlist?: () => void;
  onCompare?: () => void;
}

export function ProductMainSection({
  name,
  scientificName,
  description,
  sku,
  imageUrl,
  images,
  variants,
  category,
  subcategory,
  lowestPrice,
  totalStock,
  waterRequirement,
  sunlightRequirement,
  temperatureMin,
  temperatureMax,
  humidityLevel,
  soilType,
  pruningFrequency,
  season,
  fertilizingFrequency,
  petToxicity,
  careInstructions,
  isLoggedIn,
  onAddToCart,
  onWishlist,
}: ProductMainSectionProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants.length > 0 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const galleryImages = [
    ...(imageUrl ? [{ id: 0, imageUrl }] : []),
    ...images,
  ].filter(
    (image, index, array) =>
      Boolean(image.imageUrl) &&
      array.findIndex((item) => item.imageUrl === image.imageUrl) === index
  );

  const isInStock = totalStock > 0;
  const mainImage = galleryImages[selectedImage]?.imageUrl || imageUrl;
  console.log(mainImage);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant
    ? getVariantPrice(selectedVariant.price)
    : lowestPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const discountPercentage =
    compareAtPrice && currentPrice
      ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
      : null;

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (idx: number) => {
    setSelectedImage(idx);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    const maxStock = selectedVariant?.stock || 99;
    setQuantity(Math.min(Math.max(1, newQty), maxStock));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onWishlist?.();
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-sm">
          <div className="relative aspect-square">
            <img
              src={mainImage || "/placeholder.png"}
              alt={name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {discountPercentage && discountPercentage > 0 && (
            <Badge className="absolute left-4 top-4 border-0 bg-red-500 px-2.5 py-1 text-sm font-semibold text-white">
              {discountPercentage}% OFF
            </Badge>
          )}

          {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <Badge className="absolute left-4 top-4 border-0 bg-amber-500 px-2.5 py-1 text-xs text-white">
              Only {selectedVariant.stock} left
            </Badge>
          )}

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:shadow-xl"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:shadow-xl"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {galleryImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === idx
                    ? "scale-95 border-brand-600 shadow-md"
                    : "border-transparent opacity-70 hover:border-gray-300 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {name}
            </h1>
            {scientificName && (
              <p className="mt-2 text-base italic text-gray-500">{scientificName}</p>
            )}
          </div>
          <button
            onClick={toggleWishlist}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            {currentPrice !== null ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{currentPrice.toFixed(0)}
                </span>
                {compareAtPrice && compareAtPrice > currentPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{compareAtPrice.toFixed(0)}
                    </span>
                    <Badge className="border-green-200 bg-green-100 text-green-800">
                      Save ₹{(compareAtPrice - currentPrice).toFixed(0)}
                    </Badge>
                  </>
                )}
              </>
            ) : (
              <span className="text-2xl text-gray-500">Price not available</span>
            )}
          </div>
          {selectedVariant && (
            <p className="text-sm text-gray-500">
              Selected size:{" "}
              <span className="font-medium text-gray-700">
                {getVariantLabel(selectedVariant)}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {sku && (
            <Badge variant="outline" className="text-xs font-normal">
              SKU: {sku}
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="text-xs font-normal">
              {category.name}
            </Badge>
          )}
          {subcategory && (
            <Badge variant="outline" className="text-xs font-normal">
              {subcategory.name}
            </Badge>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed text-gray-600">
            {isExpanded ? description : `${description.substring(0, 280)}...`}
          </p>
          {description.length > 280 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {isExpanded ? "Show less" : "Read more"}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 9L12 16L5 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        <Separator className="bg-gray-200" />

        {variants.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">
                Select Size
              </label>
              {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  Low stock
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const isOutOfStock = variant.stock === 0;

                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={isOutOfStock}
                    className={`relative rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm"
                        : isOutOfStock
                          ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                          : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-25"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-base font-semibold">
                        {getVariantLabel(variant)}
                      </span>
                      <span className="mt-1 text-sm">
                        ₹{getVariantPrice(variant.price).toFixed(0)}
                      </span>
                      {isOutOfStock && (
                        <span className="mt-1 text-xs text-gray-400">Out of stock</span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <>
            <Separator className="bg-gray-200" />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex h-12 w-36 items-center rounded-lg border border-gray-300 bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex h-full w-12 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center text-base font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedVariant ? quantity >= selectedVariant.stock : false}
                    className="flex h-full w-12 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-gray-500">
                    {selectedVariant.stock} available
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding || !selectedVariant || selectedVariant.stock === 0}
                  className="h-12 flex-1 rounded-lg bg-brand-600 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:opacity-50"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-lg border-gray-300 p-0 hover:bg-gray-50"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Plant Details</h3>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {waterRequirement && <DetailItem label="Water" value={waterRequirement} />}
            {sunlightRequirement && <DetailItem label="Sunlight" value={sunlightRequirement} />}
            {temperatureMin !== undefined && temperatureMax !== undefined && (
              <DetailItem label="Temperature" value={`${temperatureMin}°-${temperatureMax}°C`} />
            )}
            {humidityLevel && <DetailItem label="Humidity" value={humidityLevel} />}
            {soilType && <DetailItem label="Soil" value={soilType} />}
            {pruningFrequency && <DetailItem label="Pruning" value={pruningFrequency} />}
            {season && <DetailItem label="Season" value={season} />}
            {fertilizingFrequency && <DetailItem label="Fertilizing" value={fertilizingFrequency} />}
            {petToxicity && (
              <DetailItem
                label="Pet Toxicity"
                value={petToxicity}
                valueClassName={
                  petToxicity === "Toxic"
                    ? "text-orange-600 font-medium"
                    : "text-green-600 font-medium"
                }
              />
            )}
            {careInstructions && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-700">Care Instructions</dt>
                <dd className="mt-1 text-sm text-gray-600">{careInstructions}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <dt className="w-24 shrink-0 text-sm font-medium text-gray-500">{label}:</dt>
      <dd className={`text-sm ${valueClassName}`}>{value}</dd>
    </div>
  );
}
