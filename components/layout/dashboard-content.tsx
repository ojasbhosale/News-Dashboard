"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { NewsTab } from "@/components/dashboard/news-tab"
import { AnalyticsTab } from "@/components/dashboard/analytics-tab"
import { PayoutsTab } from "@/components/dashboard/payouts-tab"
import { ReportsTab } from "@/components/dashboard/reports-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-4 lg:p-6">
      {" "}
      {/* Reduced padding */}
      <div className="mb-4">
        {" "}
        {/* Reduced margin */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Here&#39;s what&#39;s happening with your news analytics today.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {" "}
        {/* Reduced spacing */}
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="payouts">Payouts</TabsTrigger>}
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="news" className="space-y-6">
          <NewsTab />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="reports" className="space-y-6">
          <ReportsTab />
        </TabsContent>
        {user?.role === "admin" && (
          <TabsContent value="payouts" className="space-y-6">
            <PayoutsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
