"use client";

import { useAppStore } from "@/src/utils/store/store";
import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const isLoading = useAppStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center gap-4 border border-brand-100/50">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-brand-800 font-medium tracking-wide text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
