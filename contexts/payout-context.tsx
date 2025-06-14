"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { PayoutRate, PayoutData, Article, ExportOptions } from "@/types"
import { storageManager } from "@/lib/storage"
import { generateId } from "@/lib/utils"

interface PayoutContextType {
  payoutRates: PayoutRate[]
  updatePayoutRate: (rate: Omit<PayoutRate, "id" | "createdAt" | "updatedAt">) => void
  deletePayoutRate: (id: string) => void
  calculatePayouts: (articles: Article[]) => PayoutData[]
  exportData: (options: ExportOptions) => Promise<void>
  getTotalPayout: (articles: Article[]) => number
  getPayoutBySource: (articles: Article[]) => Record<string, PayoutData>
  getPayoutByAuthor: (articles: Article[]) => Record<string, PayoutData>
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined)

export function PayoutProvider({ children }: { children: ReactNode }) {
  const [payoutRates, setPayoutRates] = useState<PayoutRate[]>([])

  // Helper function to normalize storage PayoutRate to main PayoutRate type
  type StoragePayoutRate = {
    id: string
    source: string
    author?: string
    rate: number
    type?: string
    createdAt?: string
    lastUpdated?: string
  }

  const normalizeStoragePayoutRates = useCallback((storageRates: StoragePayoutRate[]): PayoutRate[] => {
    return storageRates.map(rate => {
      const type = (rate?.type === "author" || rate?.type === "source") ? rate.type : "source"
      return {
        id: rate.id,
        source: rate.source,
        author: rate.author,
        rate: rate.rate,
        type,
        createdAt: rate.createdAt || rate.lastUpdated || new Date().toISOString(),
        updatedAt: rate.lastUpdated || new Date().toISOString(),
      }
    })
  }, [])

  // Helper function to normalize main PayoutRate to storage PayoutRate type
  const normalizeMainPayoutRates = useCallback((mainRates: PayoutRate[]) => {
    return mainRates.map(rate => ({
      id: rate.id,
      source: rate.source,
      author: rate.author,
      rate: rate.rate,
      currency: "USD",
      lastUpdated: rate.updatedAt,
    }))
  }, [])

  const loadPayoutRates = useCallback(async () => {
    try {
      const stored = await storageManager.getPayoutRates()
      if (stored.length > 0) {
        const normalizedRates = normalizeStoragePayoutRates(stored)
        setPayoutRates(normalizedRates)
      } else {
        const defaultRates: PayoutRate[] = [
          {
            id: generateId(),
            source: "The New York Times",
            rate: 75,
            type: "source",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: generateId(),
            source: "The Associated Press",
            rate: 60,
            type: "source",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: generateId(),
            source: "Default",
            rate: 35,
            type: "source",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        setPayoutRates(defaultRates)
        const normalized = normalizeMainPayoutRates(defaultRates)
        await storageManager.savePayoutRates(normalized)
      }
    } catch (error) {
      console.error("Failed to load payout rates:", error)
    }
  }, [normalizeStoragePayoutRates, normalizeMainPayoutRates])

  useEffect(() => {
    loadPayoutRates()
  }, [loadPayoutRates])

  const updatePayoutRate = async (newRate: Omit<PayoutRate, "id" | "createdAt" | "updatedAt">) => {
    const existingIndex = payoutRates.findIndex(
      (rate) => rate.source === newRate.source && rate.author === newRate.author && rate.type === newRate.type
    )

    let updatedRates: PayoutRate[]

    if (existingIndex >= 0) {
      updatedRates = payoutRates.map((rate, index) =>
        index === existingIndex
          ? { ...rate, ...newRate, updatedAt: new Date().toISOString() }
          : rate
      )
    } else {
      const fullRate: PayoutRate = {
        id: generateId(),
        ...newRate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updatedRates = [...payoutRates, fullRate]
    }

    setPayoutRates(updatedRates)
    const normalized = normalizeMainPayoutRates(updatedRates)
    await storageManager.savePayoutRates(normalized)
  }

  const deletePayoutRate = async (id: string) => {
    const updatedRates = payoutRates.filter((rate) => rate.id !== id)
    setPayoutRates(updatedRates)
    const normalized = normalizeMainPayoutRates(updatedRates)
    await storageManager.savePayoutRates(normalized)
  }

  const calculatePayouts = (articles: Article[]): PayoutData[] => {
    const sourceGroups = articles.reduce((acc, article) => {
      const source = article.source.name
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(sourceGroups).map(([source, count]) => {
      const rate = payoutRates.find(p => p.source === source && p.type === "source")
        || payoutRates.find(p => p.source === "Default" && p.type === "source")
        || { rate: 25 }

      return {
        source,
        articles: count,
        rate: rate.rate,
        total: count * rate.rate,
        type: "source",
      }
    })
  }

  const getTotalPayout = (articles: Article[]): number => {
    return calculatePayouts(articles).reduce((sum, p) => sum + p.total, 0)
  }

  const getPayoutBySource = (articles: Article[]): Record<string, PayoutData> => {
    return calculatePayouts(articles).reduce((acc, p) => {
      acc[p.source] = p
      return acc
    }, {} as Record<string, PayoutData>)
  }

  const getPayoutByAuthor = (articles: Article[]): Record<string, PayoutData> => {
    const authorGroups = articles.reduce((acc, article) => {
      const author = article.author || "Unknown"
      acc[author] = (acc[author] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(authorGroups).reduce((acc, [author, count]) => {
      const rate = payoutRates.find(p => p.author === author && p.type === "author") || { rate: 30 }
      acc[author] = {
        author,
        source: "",
        articles: count,
        rate: rate.rate,
        total: count * rate.rate,
        type: "author",
      }
      return acc
    }, {} as Record<string, PayoutData>)
  }

  const exportData = async (options: ExportOptions) => {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      })

      if (options.format === "csv") {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "payout-report.csv"
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const result = await res.json()
        console.log("Export result:", result)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  return (
    <PayoutContext.Provider
      value={{
        payoutRates,
        updatePayoutRate,
        deletePayoutRate,
        calculatePayouts,
        exportData,
        getTotalPayout,
        getPayoutBySource,
        getPayoutByAuthor,
      }}
    >
      {children}
    </PayoutContext.Provider>
  )
}

export function usePayout() {
  const context = useContext(PayoutContext)
  if (!context) {
    throw new Error("usePayout must be used within a PayoutProvider")
  }
  return context
}
