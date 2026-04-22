import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Subcategory } from "../../app/(admin)/(pages)/master/plant/add-plant/types";

type Props = {
  categoryId: string;
  subcategoryId: string;
  categories: Category[];
  subcategories: Subcategory[];
  loading: boolean;
  onSelectChange: (name: "categoryId" | "subcategoryId", value: string) => void;
};

export function CategoryFields({
  categoryId,
  subcategoryId,
  categories,
  subcategories,
  loading,
  onSelectChange,
}: Props) {
  const selectedCategoryName =
    categories.find((category) => category.id.toString() === categoryId)?.name ?? "";
  const selectedSubcategoryName =
    subcategories.find((subcategory) => subcategory.id.toString() === subcategoryId)?.name ?? "";

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select value={categoryId} onValueChange={(value) => onSelectChange("categoryId", value)}>
          <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20">
            <SelectValue placeholder={loading ? "Loading categories..." : "Select category"}>
              {selectedCategoryName || undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="cursor-pointer transition-colors hover:bg-brand-25 focus:bg-brand-25"
              >
                {category.name}
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
          value={subcategoryId}
          onValueChange={(value) => onSelectChange("subcategoryId", value)}
          disabled={loading || !categoryId}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50">
            <SelectValue placeholder={!categoryId ? "Select category first" : "Select subcategory"}>
              {selectedSubcategoryName || undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
            {subcategories.map((subcategory) => (
              <SelectItem
                key={subcategory.id}
                value={subcategory.id.toString()}
                className="cursor-pointer transition-colors hover:bg-brand-25 focus:bg-brand-25"
              >
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
