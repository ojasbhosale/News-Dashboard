"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileText, Download } from "lucide-react"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("")
  const [format, setFormat] = useState("")
  const [includeCharts, setIncludeCharts] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generate Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payout">Payout Report</SelectItem>
                <SelectItem value="analytics">Analytics Report</SelectItem>
                <SelectItem value="summary">Summary Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="sheets">Google Sheets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="charts" checked={includeCharts} onCheckedChange={checked => setIncludeCharts(checked === true)} />
            <Label htmlFor="charts">Include charts and visualizations</Label>
          </div>

          <Button className="w-full" disabled={!reportType || !format}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
