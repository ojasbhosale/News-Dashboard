"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Download, Eye } from "lucide-react"

export function ReportHistory() {
  const history = [
    {
      name: "Analytics Report - Jan 2024",
      type: "analytics",
      date: "2024-01-20",
      status: "completed",
    },
    {
      name: "Payout Summary - Dec 2023",
      type: "payout",
      date: "2024-01-15",
      status: "completed",
    },
    {
      name: "Executive Summary - Dec 2023",
      type: "summary",
      date: "2024-01-10",
      status: "processing",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Report History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((report, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{report.name}</h4>
                <Badge variant={report.status === "completed" ? "default" : "secondary"}>{report.status}</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{report.date}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={report.status !== "completed"}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" disabled={report.status !== "completed"}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
