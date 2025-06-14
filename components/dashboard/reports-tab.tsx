"use client"

import { ReportGenerator } from "@/components/reports/report-generator"
import { ReportHistory } from "@/components/reports/report-history"
import { ReportTemplates } from "@/components/reports/report-templates"

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Export</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Generate comprehensive reports and export data in various formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportGenerator />
        </div>
        <div className="space-y-6">
          <ReportTemplates />
          <ReportHistory />
        </div>
      </div>
    </div>
  )
}
