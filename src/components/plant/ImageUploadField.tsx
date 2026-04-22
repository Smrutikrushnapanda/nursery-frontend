import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  imageFiles: File[];
  imagePreviews: string[];
  maxUploads: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
};

export function ImageUploadField({
  inputRef,
  imageFiles,
  imagePreviews,
  maxUploads,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="images" className="text-sm font-medium text-gray-700">
        Images
      </Label>
      <Input
        ref={inputRef}
        id="images"
        name="images"
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="h-auto rounded-xl border-2 border-brand-200 bg-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
      />
      <p className="text-xs text-gray-500">
        You can upload up to {maxUploads} images. The first uploaded image will be treated as
        primary.
      </p>
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
          {imagePreviews.map((preview, index) => (
            <div
              key={`${preview}-${index}`}
              className="relative overflow-hidden rounded-xl border border-brand-200 bg-gray-50"
            >
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
              <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
              <p className="truncate px-3 py-2 text-xs text-gray-500">{imageFiles[index]?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
