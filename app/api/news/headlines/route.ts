import { NextResponse } from "next/server"
import { newsAPI } from "@/lib/api"

export async function GET() {
  try {
    const result = await newsAPI.getTopHeadlines()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Headlines API Error:", error)
    return NextResponse.json({ error: "Failed to fetch headlines" }, { status: 500 })
  }
}
