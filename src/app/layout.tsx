import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "Plant Store",
  description: "Buy beautiful plants online",
};

const outfit = Outfit({
  subsets: ["latin"],
});

import GlobalLoader from "@/src/components/GlobalLoader";

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
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
