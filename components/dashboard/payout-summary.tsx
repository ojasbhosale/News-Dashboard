"use client"

import type { Article } from "@/types"
import { usePayout } from "@/contexts/payout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { DollarSign } from "lucide-react"

interface PayoutSummaryProps {
  totalPayout: number
  articles: Article[]
}

export function PayoutSummary({ totalPayout, articles }: PayoutSummaryProps) {
  const { getPayoutBySource } = usePayout()

  const payoutBySource = getPayoutBySource(articles)
  const topSources = Object.values(payoutBySource)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const maxPayout = Math.max(...topSources.map((s) => s.total))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Payout Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPayout)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Earning Sources</h4>

            {topSources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">{source.source}</span>
                  <span className="text-green-600 dark:text-green-400">{formatCurrency(source.total)}</span>
                </div>
                <Progress value={(source.total / maxPayout) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{source.articles} articles</span>
                  <span>{formatCurrency(source.rate)}/article</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
