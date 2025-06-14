"use client"
import { useNews } from "@/contexts/news-context"
import { usePayout } from "@/contexts/payout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Download } from "lucide-react"

export function PayoutManagement() {
  const { articles } = useNews()
  const { calculatePayouts, exportData } = usePayout()

  const payoutData = calculatePayouts(articles)
  const totalPayout = payoutData.reduce((sum, p) => sum + p.total, 0)

  const handleExport = async (format: "pdf" | "csv" | "sheets") => {
    await exportData({
      format,
      data: payoutData,
      includeCharts: true,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payout Overview</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPayout)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total payout from {articles.length} articles across {payoutData.length} sources
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Rate per Article</TableHead>
                <TableHead>Total Payout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutData.map((payout) => (
                <TableRow key={payout.source}>
                  <TableCell className="font-medium">{payout.source}</TableCell>
                  <TableCell>{payout.articles}</TableCell>
                  <TableCell>{formatCurrency(payout.rate)}</TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(payout.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
