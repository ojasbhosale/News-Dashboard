"use client"

import { useState, useCallback } from "react"
import { useNews } from "@/contexts/news-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Calendar,
  Filter,
  X,
  RefreshCw
} from "lucide-react"

export function NewsFilters() {
  const [query, setQuery] = useState("")
  const [source, setSource] = useState("all")
  const [category, setCategory] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const { searchArticles, loading, articles, setFilters } = useNews()

  const uniqueSources = Array.from(new Set(articles.map((a) => a.source.name))).sort()
  const uniqueCategories = Array.from(
    new Set(articles.map((a) => a.category).filter((cat): cat is string => typeof cat === "string"))
  ).sort()

  type SearchFilters = {
    query?: string
    source?: string
    category?: string
    fromDate?: string
    toDate?: string
    sortBy?: "date" | "relevance" | "popularity"
  }

  const debouncedSearch = useCallback(
    (filters: SearchFilters) => {
      searchArticles(filters)
    },
    [searchArticles]
  )

  const handleInputChange = (value: string) => {
    setQuery(value)
  }

  const handleSearch = () => {
    const filters: SearchFilters = {
      query: query || undefined,
      source: source !== "all" ? source : undefined,
      category: category !== "all" ? category : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sortBy: sortBy as "date" | "relevance" | "popularity"
    }

    setFilters(filters)
    searchArticles(filters)
  }

  const handleReset = () => {
    setQuery("")
    setSource("all")
    setCategory("all")
    setFromDate("")
    setToDate("")
    setSortBy("date")
    setFilters({})
    searchArticles()
  }

  const handleQuickSearch = (tag: string) => {
    setQuery(tag)
    const filters: SearchFilters = {
      query: tag,
      sortBy: "relevance"
    }
    setFilters(filters)
    debouncedSearch(filters)
  }

  const activeFiltersCount = [
    query,
    source !== "all" && source,
    category !== "all" && category,
    fromDate,
    toDate
  ].filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Search & Filter News</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, keywords, topics..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Quick search:</span>
          {["technology", "business", "politics", "health", "sports"].map(tag => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="h-6 text-xs capitalize"
              onClick={() => handleQuickSearch(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Source Filter */}
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Source</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {uniqueSources.map(src => (
                  <SelectItem key={src} value={src}>{src}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Sort by</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest first</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">From date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">To date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {query && (
              <Badge variant="secondary" className="text-xs">
                Query: “{query}”
                <button onClick={() => { setQuery(""); handleSearch(); }} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {source !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Source: {source}
                <button onClick={() => { setSource("all"); handleSearch(); }} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {category !== "all" && (
              <Badge variant="secondary" className="text-xs capitalize">
                Category: {category}
                <button onClick={() => { setCategory("all"); handleSearch(); }} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {fromDate && (
              <Badge variant="secondary" className="text-xs">
                From: {fromDate}
                <button onClick={() => { setFromDate(""); handleSearch(); }} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {toDate && (
              <Badge variant="secondary" className="text-xs">
                To: {toDate}
                <button onClick={() => { setToDate(""); handleSearch(); }} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
