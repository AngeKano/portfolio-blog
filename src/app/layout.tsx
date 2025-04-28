// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Analytics from "../ui/components/analytics/Analytics";
import { Suspense } from "react";

// Charger la police Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Blog",
  description: "Mon portfolio personnel et blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
              Chargement...
            </div>
          }
        >
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
