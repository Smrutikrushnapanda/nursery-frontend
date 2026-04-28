import { FormField } from "@/components/common/FormField";

type Props = {
  temperatureMin: string;
  temperatureMax: string;
  errors?: Record<string, string>;
  onChange: (name: "temperatureMin" | "temperatureMax", value: string) => void;
};

function TemperatureSlider({
  field,
  label,
  value,
  error,
  onChange,
}: {
  field: "temperatureMin" | "temperatureMax";
  label: string;
  value: string;
  error?: string;
  onChange: (name: "temperatureMin" | "temperatureMax", value: string) => void;
}) {
  return (
    <FormField label={label} error={error}>
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-700">{value || "0"}°C</span>
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
          className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-brand-100 accent-brand-600 ${error ? "accent-red-500" : ""}`}
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>0°C</span>
          <span>50°C</span>
        </div>
      </div>
    </FormField>
  );
}

export function TemperatureRangeFields({
  temperatureMin,
  temperatureMax,
  errors = {},
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <TemperatureSlider
        field="temperatureMin"
        label="Temperature Min"
        value={temperatureMin}
        error={errors.temperatureMin}
        onChange={onChange}
      />
      <TemperatureSlider
        field="temperatureMax"
        label="Temperature Max"
        value={temperatureMax}
        error={errors.temperatureMax}
        onChange={onChange}
      />
    </div>
  );
}
