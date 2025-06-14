"use client"

import { useNews } from "@/contexts/news-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function NewsAnalytics() {
  const { articles } = useNews()

  // Group articles by source
  const sourceData = articles.reduce(
    (acc, article) => {
      const source = article.source.name
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(sourceData)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
