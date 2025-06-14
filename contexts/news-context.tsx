"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Article, NewsResponse, FilterOptions } from "@/types"
import { newsAPI } from "@/lib/api"
import { storageManager } from "@/lib/storage"
import { useOffline } from "@/contexts/offline-context"

interface NewsContextType {
  articles: Article[]
  headlines: Article[]
  loading: boolean
  error: string | null
  searchArticles: (filters?: FilterOptions) => Promise<void>
  getHeadlines: () => Promise<void>
  totalArticles: number
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  clearError: () => void
  refreshData: () => Promise<void>
}

const NewsContext = createContext<NewsContextType | undefined>(undefined)

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [headlines, setHeadlines] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalArticles, setTotalArticles] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const { isOnline } = useOffline()

  // Only fetch if we haven't fetched recently (within 30 minutes)
  const shouldFetch = useCallback(() => {
    const now = Date.now()
    const thirtyMinutes = 30 * 60 * 1000
    return now - lastFetchTime > thirtyMinutes
  }, [lastFetchTime])

  // Helper function to ensure articles match the expected Article type
  const normalizeArticles = (articles: unknown[]): Article[] => {
    return articles.map(article => {
      const a = article as Partial<Article>;
      return {
        ...a,
        image: a.image || null, // Provide default if missing
        type: a.type || 'article' // Provide default if missing
      } as Article;
    })
  }

  const searchArticles = useCallback(
    async (newFilters?: FilterOptions) => {
      // Don't fetch if we have recent data and no new filters
      if (!shouldFetch() && !newFilters && articles.length > 0) {
        return
      }

      setLoading(true)
      setError(null)

      const searchFilters = newFilters || filters

      try {
        let result: NewsResponse

        if (isOnline) {
          result = await newsAPI.searchArticles(searchFilters)
          setLastFetchTime(Date.now())
          // Save to offline storage
          await storageManager.saveArticles(result.articles)
        } else {
          // Load from offline storage and normalize
          const offlineArticles = await storageManager.getArticles()
          const normalizedArticles = normalizeArticles(offlineArticles)
          result = {
            totalArticles: normalizedArticles.length,
            articles: normalizedArticles,
            status: "offline",
          }
        }

        setArticles(result.articles)
        setTotalArticles(result.totalArticles)

        if (newFilters) {
          setFilters(newFilters)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch articles"
        setError(errorMessage)

        // Try to load from offline storage as fallback
        try {
          const offlineArticles = await storageManager.getArticles()
          if (offlineArticles.length > 0) {
            const normalizedArticles = normalizeArticles(offlineArticles)
            setArticles(normalizedArticles)
            setTotalArticles(normalizedArticles.length)
            setError("Using cached data - " + errorMessage)
          }
        } catch (offlineError) {
          console.error("Failed to load offline data:", offlineError)
        }
      } finally {
        setLoading(false)
      }
    },
    [filters, isOnline, shouldFetch, articles.length],
  )

  const getHeadlines = useCallback(async () => {
    try {
      if (isOnline) {
        const result = await newsAPI.getTopHeadlines()
        setHeadlines(result.articles)
      }
    } catch (err) {
      console.error("Failed to fetch headlines:", err)
    }
  }, [isOnline])

  const clearError = () => setError(null)

  const refreshData = useCallback(async () => {
    await Promise.all([searchArticles(), getHeadlines()])
  }, [searchArticles, getHeadlines])

  // Only fetch on mount, not on every render
  useEffect(() => {
    if (articles.length === 0) {
      searchArticles()
    }
  }, [articles.length, searchArticles])

  return (
    <NewsContext.Provider
      value={{
        articles,
        headlines,
        loading,
        error,
        searchArticles,
        getHeadlines,
        totalArticles,
        filters,
        setFilters,
        clearError,
        refreshData,
      }}
    >
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  const context = useContext(NewsContext)
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider")
  }
  return context
}