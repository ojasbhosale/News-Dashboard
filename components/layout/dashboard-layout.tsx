"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
// import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardContent } from "@/components/layout/dashboard-content"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        {" "}
        {/* Fixed height minus header */}
        {/* <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
        <main className="flex-1 overflow-auto lg:ml-0">
          {" "}
          {/* Remove margin, let sidebar handle positioning */}
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
