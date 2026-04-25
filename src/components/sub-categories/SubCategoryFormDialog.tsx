import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { SubcategoryForm } from "@/app/(admin)/(pages)/master/sub-category/types";


type CategoryOption = {
  id: number;
  name: string;
};

type Props = {
  isOpen: boolean;
  isEditing: boolean;
  form: SubcategoryForm;
  saving: boolean;
  categoryOptions: CategoryOption[];
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function SubCategoryFormDialog({
  isOpen,
  isEditing,
  form,
  saving,
  categoryOptions,
  onClose,
  onInputChange,
  onCategoryChange,
  onSubmit,
}: Props) {
  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Sub Category" : "Add Sub Category"}
      description={
        isEditing
          ? "Update the selected sub-category details."
          : "Create a new sub-category for your nursery master data."
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="categoryId">
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Sub Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={onInputChange}
            placeholder="e.g., Money Plant"
            required
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || !form.name.trim() || !form.categoryId}
            className="rounded-xl"
          >
            {saving
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Sub Category"
                : "Add Sub Category"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
