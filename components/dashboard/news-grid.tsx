"use client"

import { useState } from "react"
import { useNews } from "@/contexts/news-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDate } from "@/lib/utils"

export function NewsGrid() {
  const { articles, loading, error } = useNews()
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = articles.slice(startIndex, endIndex)
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading articles: {error}. Showing sample data instead.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {article.image && (
              <div className="aspect-video relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {article.category}
                  </Badge>
                </div>
              </div>
            )}

            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white">{article.title}</h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{article.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-20">{article.source.name}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>

                  {article.readTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime} min</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(article.url, "_blank")}
                    className="h-8"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Read
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
