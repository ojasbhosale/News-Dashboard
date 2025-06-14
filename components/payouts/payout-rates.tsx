"use client"

import type React from "react"

import { useState } from "react"
import { usePayout } from "@/contexts/payout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function PayoutRates() {
  const [source, setSource] = useState("")
  const [author, setAuthor] = useState("")
  const [rate, setRate] = useState("")
  const [type, setType] = useState<"source" | "author">("source")
  const { updatePayoutRate } = usePayout()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((type === "source" && source) || (type === "author" && author)) {
      updatePayoutRate({
        source: type === "source" ? source : "",
        author: type === "author" ? author : undefined,
        rate: Number.parseFloat(rate),
        type,
      })
      setSource("")
      setAuthor("")
      setRate("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Payout Rate</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Rate Type</Label>
            <Select value={type} onValueChange={(value: "source" | "author") => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source">By Source</SelectItem>
                <SelectItem value="author">By Author</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "source" ? (
            <div>
              <Label htmlFor="source">Source Name</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter source name"
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="rate">Rate per Article ($)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              min="0"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Rate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
