import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { basicFields } from "@/app/(admin)/(pages)/master/plant/add-plant/config";
import { PlantFormState } from "@/app/(admin)/(pages)/master/plant/add-plant/types";

type Props = {
  form: PlantFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PlantTextFields({ form, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {basicFields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.name === "price" ? "number" : "text"}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={onChange}
            required={field.required}
            min={field.name === "price" ? "0" : undefined}
            step={field.name === "price" ? "0.01" : undefined}
            className="h-11 rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
          />
        </div>
      ))}
    </div>
  );
}
