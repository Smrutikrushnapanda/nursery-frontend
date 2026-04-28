"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({ 
  label, 
  error, 
  children, 
  className, 
  required 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <Label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </Label>
      )}
      <div className="relative group">
        {children}
      </div>
      {error && (
        <p className="text-[11px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
