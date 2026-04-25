import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlantFormState } from "../types";

type Props = {
  form: PlantFormState;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function PlantTextareas({ form, onChange }: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the plant"
          rows={4}
          value={form.description}
          onChange={onChange}
          className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="careInstructions" className="text-sm font-medium text-gray-700">
          Care Instructions
        </Label>
        <Textarea
          id="careInstructions"
          name="careInstructions"
          placeholder="Watering, placement, maintenance, and other care instructions"
          rows={4}
          value={form.careInstructions}
          onChange={onChange}
          className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
        />
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
          value={form.petToxicityNotes}
          onChange={onChange}
          className="resize-none rounded-xl border-2 border-brand-200 bg-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
        />
      </div>
    </>
  );
}
