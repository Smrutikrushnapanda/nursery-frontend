import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
  disabled: boolean;
};

export function AddPlantSubmitButton({ loading, disabled }: Props) {
  return (
    <div className="pt-2">
      <Button
        type="submit"
        disabled={disabled}
        className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 text-base font-semibold text-white shadow-md transition-all hover:from-brand-600 hover:to-brand-500 hover:shadow-lg disabled:opacity-60"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Adding Plant...
            </>
          ) : (
            <>
              <Sprout className="h-5 w-5" />
              Add Plant
            </>
          )}
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Button>
    </div>
  );
}
