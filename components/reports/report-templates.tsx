"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Star } from "lucide-react"

export function ReportTemplates() {
  const templates = [
    {
      name: "Executive Summary",
      description: "High-level overview for stakeholders",
      popular: true,
    },
    {
      name: "Detailed Analytics",
      description: "Comprehensive data analysis",
      popular: false,
    },
    {
      name: "Payout Breakdown",
      description: "Source and author payout details",
      popular: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Report Templates</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{template.name}</h4>
                {template.popular && <Star className="h-4 w-4 text-yellow-500" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{template.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
