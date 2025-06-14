"use client"

import { useNews } from "@/contexts/news-context"
import { usePayout } from "@/contexts/payout-context"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentNews } from "@/components/dashboard/recent-news"
import { PayoutSummary } from "@/components/dashboard/payout-summary"
import { TrendingTopics } from "@/components/dashboard/trending-topics"

export function OverviewTab() {
  const { articles, headlines } = useNews()
  const { getTotalPayout } = usePayout()

  const totalPayout = getTotalPayout(articles)

  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentNews articles={headlines.slice(0, 5)} />
          <TrendingTopics articles={articles} />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <PayoutSummary totalPayout={totalPayout} articles={articles} />
        </div>
      </div>
    </div>
  )
}
