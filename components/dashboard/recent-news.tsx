"use client"

import type { Article } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface RecentNewsProps {
  articles: Article[]
}

export function RecentNews({ articles }: RecentNewsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Headlines</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.slice(0, 5).map((article, index) => (
            <div
              key={index}
              className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {article.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white">{article.title}</h3>

                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.source.name}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(article.url, "_blank")}
                    className="h-6 px-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
