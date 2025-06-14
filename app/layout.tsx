import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Analytics Dashboard",
  description:
    "Advanced news dashboard with analytics, payout management, and comprehensive reporting",
  keywords: ["news", "analytics", "dashboard", "payout", "reporting"],
  authors: [{ name: "News Dashboard Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
