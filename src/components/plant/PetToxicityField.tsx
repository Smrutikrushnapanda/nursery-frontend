import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { petToxicityOptions } from "@/app/(admin)/(pages)/master/plant/add-plant/config";

type Props = {
  toxicityValue: string;
  noteValue: string;
  onSelectChange: (name: any, value: string) => void;
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function PetToxicityField({ toxicityValue, noteValue, onSelectChange, onNoteChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="petToxicity" className="text-sm font-medium text-gray-700">
          Pet Toxicity
        </Label>
        <Select value={toxicityValue} onValueChange={(nextValue) => onSelectChange("petToxicity", nextValue)}>
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

      <div className="space-y-2">
        <Label htmlFor="petToxicityNotes" className="text-sm font-medium text-gray-700">
          Pet Toxicity Notes
        </Label>
        <Textarea
          id="petToxicityNotes"
          name="petToxicityNotes"
          placeholder="Add notes like safe for cats, toxic if ingested, etc."
          rows={3}
          value={noteValue}
          onChange={onNoteChange}
          className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
        />
      </div>
    </div>
  );
}
