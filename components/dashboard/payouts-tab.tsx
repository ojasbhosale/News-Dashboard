"use client"

import { useAuth } from "@/contexts/auth-context"
import { PayoutManagement } from "@/components/payouts/payout-management"
import { PayoutRates } from "@/components/payouts/payout-rates"
import { PayoutReports } from "@/components/payouts/payout-reports"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function PayoutsTab() {
  const { user } = useAuth()

  if (user?.role !== "admin") {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Badge variant="secondary" className="mb-2">
            Admin Access Required
          </Badge>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Restricted Access</h3>
          <p className="text-gray-600 dark:text-gray-400">Only administrators can access payout management features.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payout Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage payout rates, calculate earnings, and generate reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PayoutManagement />
        </div>
        <div className="space-y-6">
          <PayoutRates />
          <PayoutReports />
        </div>
      </div>
    </div>
  )
}
