"use client"

import type { Article } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash } from "lucide-react"

interface TrendingTopicsProps {
  articles: Article[]
}

export function TrendingTopics({ articles }: TrendingTopicsProps) {
  // Extract and count tags from articles
  const tagCounts = articles.reduce(
    (acc, article) => {
      article.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const trendingTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Extract categories
  const categoryCounts = articles.reduce(
    (acc, article) => {
      if (article.category) {
        acc[article.category] = (acc[article.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const trendingCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {trendingCategories.map(([category, count]) => (
                <Badge key={category} variant="outline" className="capitalize">
                  {category} ({count})
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trending Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(([tag, count]) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
