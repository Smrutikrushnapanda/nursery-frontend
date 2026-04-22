import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { CategoryForm } from "@/app/(admin)/(pages)/master/category/types";


type Props = {
  isOpen: boolean;
  isEditing: boolean;
  form: CategoryForm;
  saving: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CategoryFormDialog({
  isOpen,
  isEditing,
  form,
  saving,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add Category"}
      description={
        isEditing
          ? "Update the selected category details."
          : "Create a new category for your nursery master data."
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g., Indoor Plants"
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Describe what this category is used for"
            rows={4}
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="rounded-xl">
            {saving
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Category"
                : "Add Category"}
          </Button>
        </div>
      </form>
    </DashboardDialog>
  );
}
