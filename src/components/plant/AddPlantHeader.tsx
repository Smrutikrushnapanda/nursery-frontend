import { Sprout, Pencil } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function AddPlantHeader({ isEdit = false }: { isEdit?: boolean }) {
  return (
    <CardHeader className="relative pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 shadow-md">
            {isEdit ? <Pencil className="h-5 w-5 text-white" /> : <Sprout className="h-5 w-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-brand-800">
              {isEdit ? "Edit Plant" : "Add New Plant"}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Update the plant details below"
                : "Fill in the details to add a plant to your inventory"}
            </p>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
