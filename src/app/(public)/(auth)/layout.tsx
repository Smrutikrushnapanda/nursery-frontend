"use client";

import GridShape from "@/components/common/GridShape";
import LoginProtectedRoute from "@/components/ProtectedRoutes/LoginProtectedRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden selection:bg-brand-500/30">
      <LoginProtectedRoute>
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
          {/* Grid Background Shapes */}
          <GridShape />
          
          <main className="relative z-10 w-full max-w-md">
            {children}
          </main>
        </div>
      </LoginProtectedRoute>
    </div>
  );
}
