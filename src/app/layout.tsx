import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import GlobalLoader from "@/src/components/GlobalLoader";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "PlantScan",
  description: "Advanced Nursery Management System",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={`${outfit.className} bg-white`}>
        <ThemeProvider>
          <SidebarProvider>
            {children}
            <GlobalLoader />
            <Toaster richColors position="top-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
