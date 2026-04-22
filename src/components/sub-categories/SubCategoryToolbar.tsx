import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onAddClick: () => void;
};

export function SubCategoryToolbar({ onAddClick }: Props) {
  return (
    <div className="flex w-full justify-end">
      <Button onClick={onAddClick} className="rounded p-2">
        <Plus className="h-4 w-4" />
        Add Sub Category
      </Button>
    </div>
  );
}
