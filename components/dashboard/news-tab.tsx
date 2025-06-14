"use client"

import { NewsFilters } from "@/components/dashboard/news-filters"
import { NewsGrid } from "@/components/dashboard/news-grid"
import { NewsTable } from "@/components/dashboard/news-table"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { useState } from "react"

export function NewsTab() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">News Feed</h2>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <NewsFilters />

      {viewMode === "grid" ? <NewsGrid /> : <NewsTable />}
    </div>
  )
}
