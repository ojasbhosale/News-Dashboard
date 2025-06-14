"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Newspaper,
  BarChart3,
  DollarSign,
  Settings,
  Users,
  FileText,
  TrendingUp,
  X,
} from "lucide-react"

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const navigation = [
    { id: "overview", name: "Overview", icon: LayoutDashboard, href: "#" },
    { id: "news", name: "News Feed", icon: Newspaper, href: "#" },
    { id: "analytics", name: "Analytics", icon: BarChart3, href: "#" },
    { id: "reports", name: "Reports", icon: FileText, href: "#" },
  ]

  const adminNavigation = [
    { id: "payouts", name: "Payouts", icon: DollarSign, href: "#" },
    { id: "users", name: "Users", icon: Users, href: "#" },
    { id: "settings", name: "Settings", icon: Settings, href: "#" },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto", // Always visible on large screens
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0", // Mobile toggle behavior
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Close button for mobile - remove extra padding */}
          <div className="flex items-center justify-between px-4 py-2 lg:hidden border-b">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - add proper scrolling */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id)
                    onClose()
                  }}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>

            {user?.role === "admin" && (
              <>
                <div className="pt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-2 space-y-1">
                    {adminNavigation.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab(item.id)
                          onClose()
                        }}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </nav>

          {/* Footer - reduce padding */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">News Analytics</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">v2.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for large screens to prevent content overlap */}
      <div className="hidden lg:block w-64 flex-shrink-0"></div>
    </>
  )
}
