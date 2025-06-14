export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
  provider?: "email" | "google" | "github"
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  author?: string
  source: {
    name: string
    url: string
  }
  category?: string
  type: "news" | "blog"
  readTime?: number
  tags?: string[]
}

export interface NewsResponse {
  totalArticles: number
  articles: Article[]
  status: string
}

export interface PayoutRate {
  id: string
  source: string
  author?: string
  rate: number
  type: "source" | "author"
  createdAt: string
  updatedAt: string
}

export interface PayoutData {
  source: string
  author?: string
  articles: number
  rate: number
  total: number
  type: "source" | "author"
}

export interface FilterOptions {
  query?: string
  author?: string
  source?: string
  category?: string
  type?: "news" | "blog"
  fromDate?: string
  toDate?: string
  sortBy?: "date" | "relevance" | "popularity"
  sortOrder?: "asc" | "desc"
}

export interface ExportOptions {
  format: "pdf" | "csv" | "sheets"
  data: PayoutData[]
  filters?: FilterOptions
  includeCharts?: boolean
}
