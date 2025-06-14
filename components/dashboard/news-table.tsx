"use client"

import { useState } from "react"
import { useNews } from "@/contexts/news-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Calendar, User, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDate, truncateText } from "@/lib/utils"


export function NewsTable() {
  const { articles, loading, error } = useNews()
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 10

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = articles.slice(startIndex, endIndex)
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading articles...</span>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>News Articles ({articles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArticles.map((article, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    {article.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      <div className="font-medium line-clamp-2">{article.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {truncateText(article.description, 100)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{article.source.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{article.author || "Unknown"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">{formatDate(article.publishedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {article.readTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{article.readTime} min</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => window.open(article.url, "_blank")}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalPages}
              </span>

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
      </CardContent>
    </Card>
  )
}
