"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NewsProvider } from "@/contexts/news-context"
import { PayoutProvider } from "@/contexts/payout-context"
import { OfflineProvider } from "@/contexts/offline-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <OfflineProvider>
          <NewsProvider>
            <PayoutProvider>{children}</PayoutProvider>
          </NewsProvider>
        </OfflineProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
