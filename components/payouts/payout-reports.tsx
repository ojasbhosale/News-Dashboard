"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar } from "lucide-react"

export function PayoutReports() {
  const reports = [
    {
      name: "Monthly Report",
      description: "Last 30 days payout summary",
      date: "2024-01-15",
      size: "2.3 MB",
    },
    {
      name: "Weekly Report",
      description: "Last 7 days payout summary",
      date: "2024-01-20",
      size: "1.1 MB",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Recent Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{report.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{report.description}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{report.date}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
