import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { petToxicityOptions } from "@/app/(admin)/(pages)/master/plant/add-plant/config";

type Props = {
  value: string;
  onChange: (name: "petToxicity", value: string) => void;
};

export function PetToxicityField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="petToxicity" className="text-sm font-medium text-gray-700">
        Pet Toxicity
      </Label>
      <Select value={value} onValueChange={(nextValue) => onChange("petToxicity", nextValue)}>
        <SelectTrigger className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white text-gray-700 transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20">
          <SelectValue placeholder="Select pet toxicity level" />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-xl border-2 border-brand-200 bg-white shadow-theme-lg">
          {petToxicityOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
