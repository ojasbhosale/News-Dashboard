import { type NextRequest, NextResponse } from "next/server"
import { newsAPI } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      query: searchParams.get("q") || undefined,
      author: searchParams.get("author") || undefined,
      source: searchParams.get("source") || undefined,
      category: searchParams.get("category") || undefined,
      type: (searchParams.get("type") as "news" | "blog") || undefined,
      fromDate: searchParams.get("from") || undefined,
      toDate: searchParams.get("to") || undefined,
      sortBy: (searchParams.get("sortBy") as "date" | "relevance" | "popularity") || "date",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    }

    const result = await newsAPI.searchArticles(filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
