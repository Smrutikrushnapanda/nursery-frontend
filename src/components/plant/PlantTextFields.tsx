import { Input } from "@/components/ui/input";
import { basicFields } from "@/app/(admin)/(pages)/master/plant/add-plant/config";
import { PlantFormState } from "@/app/(admin)/(pages)/master/plant/add-plant/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";

type Props = {
  form: PlantFormState;
  errors?: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof PlantFormState, value: string) => void;
};

export function PlantTextFields({ form, errors = {}, onChange, onSelectChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {basicFields.map((field) => (
        <FormField 
          key={field.name} 
          label={field.label} 
          error={errors[field.name]} 
          required={field.required}
        >
          {field.type === "select" ? (
            <Select
              value={form[field.name] as string}
              onValueChange={(value) => onSelectChange(field.name, value)}
            >
              <SelectTrigger className={`h-11 w-full rounded-xl border-2 bg-white px-4 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 ${errors[field.name] ? "border-red-500" : "border-brand-200"}`}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={onChange}
              className={`h-11 rounded-xl border-2 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 ${errors[field.name] ? "border-red-500" : "border-brand-200"}`}
            />
          )}
        </FormField>
      ))}
    </div>
  );
}
