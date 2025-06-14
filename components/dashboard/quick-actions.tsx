"use client"

import { useNews } from "@/contexts/news-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Search, Settings, Plus, BarChart3 } from "lucide-react"

export function QuickActions() {
  const { refreshData, loading } = useNews()

  const actions = [
    {
      title: "Refresh Data",
      description: "Update news feed",
      icon: RefreshCw,
      action: refreshData,
      loading: loading,
    },
    {
      title: "Search News",
      description: "Find specific articles",
      icon: Search,
      action: () => console.log("Search"),
    },
    {
      title: "Export Report",
      description: "Download analytics",
      icon: Download,
      action: () => console.log("Export"),
    },
    {
      title: "Add Source",
      description: "New news source",
      icon: Plus,
      action: () => console.log("Add source"),
    },
    {
      title: "View Analytics",
      description: "Detailed insights",
      icon: BarChart3,
      action: () => console.log("Analytics"),
    },
    {
      title: "Settings",
      description: "Configure dashboard",
      icon: Settings,
      action: () => console.log("Settings"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={action.action}
              disabled={action.loading}
            >
              <div className="flex items-center space-x-2 w-full">
                <action.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-left">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
