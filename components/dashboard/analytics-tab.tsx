"use client"

import { NewsAnalytics } from "@/components/analytics/news-analytics"
import { SourceAnalytics } from "@/components/analytics/source-analytics"
import { AuthorAnalytics } from "@/components/analytics/author-analytics"
import { TimelineAnalytics } from "@/components/analytics/timeline-analytics"

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into your news content and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsAnalytics />
        <SourceAnalytics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuthorAnalytics />
        <TimelineAnalytics />
      </div>
    </div>
  )
}
