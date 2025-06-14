import type { Article, NewsResponse, FilterOptions } from "@/types"

const GNEWS_API_KEY = "13f2b37b4d0277aef2d546a40e2dc554"
const GNEWS_BASE_URL = "https://gnews.io/api/v4"

// Type definitions for API responses
interface GNewsArticle {
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

interface GNewsResponse {
  totalArticles: number
  articles: GNewsArticle[]
}

interface CacheData {
  data: NewsResponse
  timestamp: number
}

export class NewsAPI {
  private static instance: NewsAPI
  private cache = new Map<string, CacheData>()
  private cacheTimeout = 60 * 60 * 1000 // 1 hour
  private requestCount = 0
  private dailyLimit = 90 // Leave some buffer from 100
  private lastResetDate = new Date().toDateString()

  private checkRateLimit(): boolean {
    const today = new Date().toDateString()
    if (today !== this.lastResetDate) {
      this.requestCount = 0
      this.lastResetDate = today
    }

    if (this.requestCount >= this.dailyLimit) {
      console.warn("Daily API limit reached, using cached data")
      return false
    }

    return true
  }

  private incrementRequestCount() {
    this.requestCount++
    console.log(`API requests used today: ${this.requestCount}/${this.dailyLimit}`)
  }

  static getInstance(): NewsAPI {
    if (!NewsAPI.instance) {
      NewsAPI.instance = new NewsAPI()
    }
    return NewsAPI.instance
  }

  private getCacheKey(endpoint: string, params: Record<string, string | number | boolean | undefined>): string {
    return `${endpoint}_${JSON.stringify(params)}`
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout
  }

  async searchArticles(filters: FilterOptions = {}): Promise<NewsResponse> {
    const cacheKey = this.getCacheKey("search", filters as Record<string, string | number | boolean | undefined>)
    const cached = this.cache.get(cacheKey)

    // Always return cached data if available
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    // Check rate limit before making API call
    if (!this.checkRateLimit()) {
      // Return cached data even if expired, or fallback data
      if (cached) {
        return cached.data
      }
      return this.getFallbackData()
    }

    try {
      this.incrementRequestCount()

      const params = new URLSearchParams({
        q: filters.query || "technology",
        token: GNEWS_API_KEY,
        lang: "en",
        max: "50", // Reduced from 100 to get more variety with fewer requests
        sortby: filters.sortBy || "publishedAt",
      })

      if (filters.fromDate) params.append("from", filters.fromDate)
      if (filters.toDate) params.append("to", filters.toDate)

      const response = await fetch(`${GNEWS_BASE_URL}/search?${params}`)

      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate limit exceeded")
          return cached?.data || this.getFallbackData()
        }
        throw new Error(`API Error: ${response.status}`)
      }

      const data: GNewsResponse = await response.json()

      // Transform articles to include additional fields
      const transformedArticles: Article[] = data.articles.map((article: GNewsArticle, index: number) => ({
        id: `gnews_${Date.now()}_${index}`,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source,
        type: "news" as const,
        author: article.source?.name || "Unknown",
        category: this.categorizeArticle(article.title + " " + article.description),
        readTime: this.calculateReadTime(article.content || article.description),
        tags: this.extractTags(article.title + " " + article.description),
      }))

      const result: NewsResponse = {
        totalArticles: data.totalArticles,
        articles: transformedArticles,
        status: "success",
      }

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result
    } catch (error) {
      console.error("News API Error:", error)
      return cached?.data || this.getFallbackData()
    }
  }

  async getTopHeadlines(): Promise<NewsResponse> {
    const cacheKey = this.getCacheKey("headlines", {})
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    if (!this.checkRateLimit()) {
      return cached?.data || this.getFallbackData()
    }

    try {
      this.incrementRequestCount()

      const params = new URLSearchParams({
        token: GNEWS_API_KEY,
        lang: "en",
        max: "50",
      })

      const response = await fetch(`${GNEWS_BASE_URL}/top-headlines?${params}`)

      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate limit exceeded")
          return cached?.data || this.getFallbackData()
        }
        throw new Error(`API Error: ${response.status}`)
      }

      const data: GNewsResponse = await response.json()

      const transformedArticles: Article[] = data.articles.map((article: GNewsArticle, index: number) => ({
        id: `headlines_${Date.now()}_${index}`,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source,
        type: "news" as const,
        author: article.source?.name || "Unknown",
        category: this.categorizeArticle(article.title + " " + article.description),
        readTime: this.calculateReadTime(article.content || article.description),
        tags: this.extractTags(article.title + " " + article.description),
      }))

      const result: NewsResponse = {
        totalArticles: data.totalArticles,
        articles: transformedArticles,
        status: "success",
      }

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result
    } catch (error) {
      console.error("Headlines API Error:", error)
      return cached?.data || this.getFallbackData()
    }
  }

  private categorizeArticle(text: string): string {
    const categories: Record<string, string[]> = {
      technology: ["tech", "ai", "software", "computer", "digital", "internet"],
      business: ["business", "economy", "finance", "market", "stock", "company"],
      sports: ["sport", "football", "basketball", "soccer", "game", "player"],
      health: ["health", "medical", "doctor", "hospital", "medicine", "covid"],
      politics: ["politics", "government", "election", "president", "congress"],
      entertainment: ["entertainment", "movie", "music", "celebrity", "film"],
    }

    const lowerText = text.toLowerCase()

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return category
      }
    }

    return "general"
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  private extractTags(text: string): string[] {
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ])
    const words = text.toLowerCase().match(/\b\w+\b/g) || []

    const wordCount = words.reduce(
      (acc, word) => {
        if (!commonWords.has(word) && word.length > 3) {
          acc[word] = (acc[word] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)
  }

  private getFallbackData(): NewsResponse {
    return {
      totalArticles: 1,
      articles: [
        {
          id: "fallback_1",
          title: "News Service Temporarily Unavailable",
          description: "We're experiencing technical difficulties. Please try again later.",
          content:
            "The news service is currently unavailable. This is sample content to demonstrate the application's fallback functionality.",
          url: "#",
          image: "/placeholder.svg?height=200&width=300",
          publishedAt: new Date().toISOString(),
          source: { name: "System", url: "#" },
          type: "news",
          author: "System",
          category: "general",
          readTime: 1,
          tags: ["system", "fallback"],
        },
      ],
      status: "fallback",
    }
  }

  // Additional utility methods
  getRemainingRequests(): number {
    return Math.max(0, this.dailyLimit - this.requestCount)
  }

  getCacheSize(): number {
    return this.cache.size
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; timeout: number; requestsUsed: number; remainingRequests: number } {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      requestsUsed: this.requestCount,
      remainingRequests: this.getRemainingRequests(),
    }
  }
}

export const newsAPI = NewsAPI.getInstance()
export type { GNewsArticle, GNewsResponse, CacheData }