import { Label } from "@/components/ui/label";

type Props = {
  temperatureMin: string;
  temperatureMax: string;
  onChange: (name: "temperatureMin" | "temperatureMax", value: string) => void;
};

function TemperatureSlider({
  field,
  label,
  value,
  onChange,
}: {
  field: "temperatureMin" | "temperatureMax";
  label: string;
  value: string;
  onChange: (name: "temperatureMin" | "temperatureMax", value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={field} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <span className="text-sm font-semibold text-brand-700">{value || "0"} C</span>
      </div>
      <input
        id={field}
        name={field}
        type="range"
        min="0"
        max="50"
        step="1"
        value={value || "0"}
        onChange={(e) => onChange(field, e.target.value)}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-brand-100 accent-brand-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0 C</span>
        <span>50 C</span>
      </div>
    </div>
  );
}

export function TemperatureRangeFields({
  temperatureMin,
  temperatureMax,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <TemperatureSlider
        field="temperatureMin"
        label="Temperature Min"
        value={temperatureMin}
        onChange={onChange}
      />
      <TemperatureSlider
        field="temperatureMax"
        label="Temperature Max"
        value={temperatureMax}
        onChange={onChange}
      />
    </div>
  );
}
