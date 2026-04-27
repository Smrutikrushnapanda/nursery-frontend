"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { useAppStore } from "@/utils/store/store";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import LoginProtectedRoute from "@/components/ProtectedRoutes/LoginProtectedRoute";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-background z-1 sm:p-0">
     <LoginProtectedRoute>
       <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          {children}
        </div>
      </ThemeProvider>
     </LoginProtectedRoute>
    </div>
  );
}
