"use client"

import { useNews } from "@/contexts/news-context"
import { usePayout } from "@/contexts/payout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, DollarSign, TrendingUp, Users, Clock, Globe } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function StatsCards() {
  const { articles, totalArticles, loading } = useNews()
  const { getTotalPayout } = usePayout()

  const totalPayout = getTotalPayout(articles)
  const uniqueSources = new Set(articles.map((a) => a.source.name)).size
  const uniqueAuthors = new Set(articles.map((a) => a.author)).size
  const avgReadTime =
    articles.length > 0 ? Math.round(articles.reduce((sum, a) => sum + (a.readTime || 0), 0) / articles.length) : 0

  const todayArticles = articles.filter(
    (article) => new Date(article.publishedAt).toDateString() === new Date().toDateString(),
  ).length

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles.toLocaleString(),
      icon: FileText,
      description: `${todayArticles} published today`,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Payout",
      value: formatCurrency(totalPayout),
      icon: DollarSign,
      description: "Calculated earnings",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "News Sources",
      value: uniqueSources.toString(),
      icon: Globe,
      description: "Active publishers",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Authors",
      value: uniqueAuthors.toString(),
      icon: Users,
      description: "Contributing writers",
      trend: "+5",
      trendUp: true,
    },
    {
      title: "Avg. Read Time",
      value: `${avgReadTime} min`,
      icon: Clock,
      description: "Per article",
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Engagement",
      value: "94.2%",
      icon: TrendingUp,
      description: "Reader retention",
      trend: "+1.2%",
      trendUp: true,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
              <Badge
                variant={stat.trendUp ? "default" : "secondary"}
                className={stat.trendUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
