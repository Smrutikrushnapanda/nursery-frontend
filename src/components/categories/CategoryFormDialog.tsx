import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDialog } from "@/components/common/DashboardDialog";
import { CategoryForm } from "@/app/(admin)/(pages)/master/category/types";
import { FormField } from "@/components/common/FormField";
import { useState } from "react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(e);
    }
  };

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
      <form onSubmit={validate} className="space-y-5">
        <FormField label="Category Name" error={errors.name} required>
          <Input
            id="name"
            name="name"
            value={form.name}
            disabled={saving}
            onChange={(e) => {
              onChange(e);
              if (errors.name) setErrors({});
            }}
            placeholder="e.g., Indoor Plants"
            className={`rounded-xl ${errors.name ? "border-red-500" : ""}`}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            id="description"
            name="description"
            value={form.description}
            disabled={saving}
            onChange={onChange}
            placeholder="Describe what this category is used for"
            rows={4}
            className="rounded-xl"
          />
        </FormField>

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
