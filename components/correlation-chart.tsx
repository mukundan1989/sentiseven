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

  // Define the correlation scale (remains static)
  const correlationScale = [
    { label: "Poor", range: "0.0-0.29", color: "#ef4444" },
    { label: "Weak", range: "0.3-0.49", color: "#f59e0b" },
    { label: "Moderate", range: "0.5-0.79", color: "#eab308" },
    { label: "Strong", range: "0.8-1.0", color: "#10b981" },
  ]

  // Helper function to get the width percentage based on win rate value
  const getWinRateWidthPercentage = (winRate: number) => {
    return `${Math.min(winRate, 100)}%` // Ensure it doesn't exceed 100%
  }

  // Helper function to get the color based on correlation value (remains static)
  const getCorrelationColor = (value: number) => {
    if (value >= 0.8) return "#10b981" // Strong - emerald
    if (value >= 0.5) return "#f59e0b" // Moderate - amber
    if (value >= 0.3) return "#eab308" // Weak - yellow
    return "#ef4444" // Poor - red
  }

  // Helper function to get the text description based on correlation value (remains static)
  const getCorrelationText = (value: number) => {
    if (value >= 0.8) return "Strong Positive"
    if (value >= 0.5) return "Moderate Positive"
    if (value >= 0.3) return "Weak Positive"
    return "Poor Correlation"
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <div className="max-w-[70%] sm:max-w-[100%]">
          {" "}
          {/* Adjusted max-width as basket is removed */}
          <CardTitle className="text-2xl font-bold">Sentiment-Price Correlation</CardTitle>
          <CardDescription className="mt-1 text-slate-400">
            This table shows the relationship between the source of information and historical price
          </CardDescription>
        </div>
        {/* Removed the Select Basket dropdown */}
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
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-lg font-medium">{source.name}</div>
                    <div className="flex items-center justify-end text-sm font-medium" style={{ color: source.color }}>
                      {/* Removed correlation number */}
                      {source.impact}
                    </div>
                  </div>

                  {/* Progress bar container (relative for absolute children) */}
                  <div className="relative h-3 w-full rounded-full bg-slate-800/50">
                    {/* Progress bar fill */}
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: getWinRateWidthPercentage(source.winRate),
                        backgroundColor: source.color,
                      }}
                    ></div>

                    {/* Vertical marker */}
                    <div
                      className="absolute top-0 h-full w-px bg-black z-10" // Changed bg-white to bg-black
                      style={{ left: getWinRateWidthPercentage(source.winRate) }}
                    ></div>

                    {/* Percentage text below marker */}
                    <div
                      className="absolute top-4 text-xs text-black z-10" // Changed text-white to text-black
                      style={{
                        left: getWinRateWidthPercentage(source.winRate),
                        transform: "translateX(-50%)", // Center text on the marker
                        textShadow: "0 0 3px rgba(255,255,255,0.8)", // Stronger white shadow for readability
                      }}
                    >
                      {source.winRate.toFixed(1)}%
                    </div>
                  </div>

                  {/* Scale labels */}
                  <div className="grid grid-cols-5 text-xs text-slate-400">
                    <div>0%</div>
                    <div className="text-center">25%</div>
                    <div className="text-center">50%</div>
                    <div className="text-center">75%</div>
                    <div className="text-right">100%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Removed the Correlation Impact Scale section */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
