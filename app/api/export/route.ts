import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { format, data } = await request.json()

    switch (format) {
      case "csv":
        const csv = generateCSV(data)
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=payout-report.csv",
          },
        })

      case "pdf":
        // In a real app, you'd use a PDF library like puppeteer or jsPDF
        return NextResponse.json({
          message: "PDF generation would be implemented with a proper PDF library",
          downloadUrl: "#",
        })

      case "sheets":
        // Google Sheets integration would go here
        return NextResponse.json({
          message: "Google Sheets integration would be implemented",
          sheetUrl: "#",
        })

      default:
        return NextResponse.json({ error: "Invalid export format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Export API Error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generateCSV(data: Record<string, unknown>[]): string {
  if (!data.length) return ""

  const headers = Object.keys(data[0]).join(",")
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(","),
    )
    .join("\n")

  return `${headers}\n${rows}`
}
