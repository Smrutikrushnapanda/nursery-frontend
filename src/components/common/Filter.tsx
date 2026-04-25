"use client";

import React, { useState, useEffect } from "react";
import { Filter as FilterIcon, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FilterField = {
  id: string;
  label: string;
  type: "select" | "text" | "date";
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  defaultValue?: any;
};

interface FilterProps {
  fields: FilterField[];
  onFilter: (values: Record<string, any>) => void;
  onReset?: () => void;
  title?: string;
  className?: string;
}

export const Filter: React.FC<FilterProps> = ({
  fields,
  onFilter,
  onReset,
  title = "Filters",
  className = "",
}) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.id] = field.defaultValue ?? "";
    });
    return initialValues;
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Apply filters automatically when values change
  useEffect(() => {
    // Check if any value is a string (text search) to apply debouncing
    const hasSearchTerm = fields.some(f => f.type === "text" && values[f.id]);
    
    if (hasSearchTerm) {
      const timer = setTimeout(() => {
        onFilter(values);
      }, 300); // 300ms debounce
      return () => clearTimeout(timer);
    } else {
      onFilter(values);
    }
  }, [values, onFilter, fields]);

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.id] = "";
    });
    setValues(initialValues);
    if (onReset) onReset();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-2 transition-all duration-300 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Compact Header/Icon */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
          <FilterIcon className="w-3 h-3 text-brand-500" />
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{title}</span>
          {Object.values(values).filter(v => v !== "").length > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] bg-brand-500 text-white rounded-full">
              {Object.values(values).filter(v => v !== "").length}
            </span>
          )}
        </div>

        {/* Fields in a row */}
        <div className="flex flex-wrap items-center gap-2">
          {fields.map((field) => (
            <div key={field.id} className="w-full min-w-[160px] sm:w-[200px]">
              {field.type === "select" ? (
                <select
                  id={field.id}
                  value={values[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full h-8 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer shadow-sm hover:border-brand-300"
                >
                  <option value="">{field.placeholder || field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type === "date" ? "date" : "text"}
                  value={values[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder || field.label}
                  className={cn(
                    "h-8 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-[11px] transition-all shadow-sm hover:border-brand-300",
                    field.type === "date" ? "pl-2 pr-1" : "px-2"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Clear Button */}
        {Object.values(values).some(v => v !== "") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
