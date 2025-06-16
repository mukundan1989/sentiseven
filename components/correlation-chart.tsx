"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon as InfoCircle, Loader2 } from "lucide-react" // Added Loader2 for loading state

export function CorrelationChart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dynamicSourceCorrelationData, setDynamicSourceCorrelationData] = useState([])

  useEffect(() => {
    const fetchSignalSummaries = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/signal-summaries")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const summaries = await response.json()

        // Map fetched summaries to the correlation chart data structure
        const updatedData = [
          {
            name: "GTrends", // Changed from "Google Trends"
            correlation: 0.92, // Keeping hardcoded as per previous state, only winRate is dynamic
            impact: "Strong Positive",
            color: "#10b981", // emerald-500
            winRate: 0, // Placeholder, will be updated
          },
          {
            name: "Twitter",
            correlation: 0.65, // Keeping hardcoded
            impact: "Moderate Positive",
            color: "#f59e0b", // amber-500
            winRate: 0, // Placeholder
          },
          {
            name: "Composite",
            correlation: 0.58, // Keeping hardcoded
            impact: "Moderate Positive",
            color: "#3b82f6", // blue-500
            winRate: 0, // Placeholder, will be calculated
          },
          {
            name: "News",
            correlation: 0.15, // Keeping hardcoded
            impact: "Poor Correlation",
            color: "#ef4444", // red-500
            winRate: 0, // Placeholder
          },
        ]

        let totalWinRate = 0
        let countForComposite = 0

        summaries.forEach((summary) => {
          const winRate = summary.win_rate_percent || 0 // Default to 0 if null/undefined
          if (summary.signal_type === "google_trends") {
            const index = updatedData.findIndex((d) => d.name === "GTrends") // Updated name here too
            if (index !== -1) {
              updatedData[index].winRate = winRate
              totalWinRate += winRate
              countForComposite++
            }
          } else if (summary.signal_type === "twitter") {
            const index = updatedData.findIndex((d) => d.name === "Twitter")
            if (index !== -1) {
              updatedData[index].winRate = winRate
              totalWinRate += winRate
              countForComposite++
            }
          } else if (summary.signal_type === "news") {
            const index = updatedData.findIndex((d) => d.name === "News")
            if (index !== -1) {
              updatedData[index].winRate = winRate
              totalWinRate += winRate
              countForComposite++
            }
          }
        })

        // Calculate composite win rate
        const compositeIndex = updatedData.findIndex((d) => d.name === "Composite")
        if (compositeIndex !== -1 && countForComposite > 0) {
          updatedData[compositeIndex].winRate = totalWinRate / countForComposite
        }

        setDynamicSourceCorrelationData(updatedData)
      } catch (err: any) {
        console.error("Error fetching signal summaries for correlation chart:", err)
        setError(err.message || "Failed to load correlation data.")
      } finally {
        setLoading(false)
      }
    }

    fetchSignalSummaries()
  }, []) // Empty dependency array to run once on mount

  // Helper function to get the width percentage based on win rate value
  const getWinRateWidthPercentage = (winRate: number) => {
    return `${Math.min(winRate, 100)}%` // Ensure it doesn't exceed 100%
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <div className="max-w-[70%] sm:max-w-[100%]">
          <CardTitle className="text-2xl font-bold">Sentiment-Price Correlation</CardTitle>
          <CardDescription className="mt-1 text-slate-400">
            This table shows the relationship between the source of information and historical price
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading correlation data...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* Header row */}
            <div className="grid grid-cols-2 gap-4 py-2 text-sm font-medium text-slate-400">
              <div>Source</div>
              <div className="flex items-center justify-end">
                Correlation Impact / Win Rate %
                <InfoCircle className="ml-1 h-4 w-4" />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800"></div>

            {/* Source rows in a 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dynamicSourceCorrelationData.map((source, index) => (
                <div key={index} className="space-y-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-lg font-medium">{source.name}</div>
                    <div className="flex items-center justify-end text-sm font-medium" style={{ color: source.color }}>
                      {source.impact}
                    </div>
                  </div>

                  {/* NEW: Scale labels ABOVE progress bar */}
                  <div className="grid grid-cols-4 text-xs text-slate-400 mb-1">
                    <div className="text-left">Weak</div>
                    <div className="text-center">Moderate</div>
                    <div className="text-center">Strong</div>
                    <div className="text-right">Very Strong</div>
                  </div>

                  {/* Progress bar container (relative for absolute children) */}
                  <div className="relative h-3 w-full rounded-full bg-slate-800/50">
                    {/* Percentage text above marker */}
                    <div
                      className="absolute bottom-[calc(100%+0.25rem)] text-xs text-black z-10"
                      style={{
                        left: getWinRateWidthPercentage(source.winRate),
                        transform: "translateX(-50%)", // Center text on the marker
                        textShadow: "0 0 3px rgba(255,255,255,0.8)", // Stronger white shadow for readability
                      }}
                    >
                      {source.winRate.toFixed(1)}%
                    </div>

                    {/* Vertical marker */}
                    <div
                      className="absolute top-0 h-full w-px bg-black z-10"
                      style={{ left: getWinRateWidthPercentage(source.winRate) }}
                    ></div>

                    {/* Progress bar fill */}
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: getWinRateWidthPercentage(source.winRate),
                        backgroundColor: source.color,
                      }}
                    ></div>
                  </div>
                  {/* Removed the old scale labels below the progress bar */}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
