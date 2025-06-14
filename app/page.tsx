"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/auth/login-page"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardLayout />
}
