"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon as InfoCircle, Loader2 } from "lucide-react"

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

        // Initial structure for correlation data, impact will be dynamic
        const updatedData = [
          {
            name: "GTrends",
            correlation: 0.92,
            color: "#10b981", // emerald-500
            winRate: 0,
          },
          {
            name: "Twitter",
            correlation: 0.65,
            color: "#06b6d4", // cyan-500
            winRate: 0,
          },
          {
            name: "Composite",
            correlation: 0.58,
            color: "#3b82f6", // blue-500
            winRate: 0,
          },
          {
            name: "News",
            correlation: 0.15,
            color: "#a855f7", // purple-500
            winRate: 0,
          },
        ]

        let totalWinRate = 0
        let countForComposite = 0

        summaries.forEach((summary) => {
          const winRate = summary.win_rate_percent || 0
          if (summary.signal_type === "google_trends") {
            const index = updatedData.findIndex((d) => d.name === "GTrends")
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
  }, [])

  // Helper function to get the width percentage based on win rate value
  const getWinRateWidthPercentage = (winRate: number) => {
    return `${Math.min(winRate, 100)}%`
  }

  // Helper function to get the impact text based on win rate
  const getWinRateImpactText = (winRate: number) => {
    if (winRate >= 76) return "Very Strong"
    if (winRate >= 51) return "Strong"
    if (winRate >= 26) return "Moderate"
    return "Weak"
  }

  return (
    <Card className="glass-morphism border-border/50 shadow-premium">
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 rounded-lg bg-gradient-accent">
              <InfoCircle className="h-6 w-6 text-white" />
            </div>
            Sentiment-Price Correlation
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Relationship between information sources and historical price movements
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground font-medium">Loading correlation data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Enhanced Header row */}
            <div className="grid grid-cols-2 gap-6 py-3 text-sm font-semibold text-muted-foreground border-b border-border/30">
              <div>Data Source</div>
              <div className="flex items-center justify-end gap-2">
                Correlation Impact / Win Rate %
                <InfoCircle className="h-4 w-4 text-primary" />
              </div>
            </div>

            {/* Enhanced Source rows in a 2x2 grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dynamicSourceCorrelationData.map((source, index) => (
                <div key={index} className="space-y-4 p-4 rounded-xl bg-gradient-card border border-border/30">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-lg font-bold text-foreground">{source.name}</div>
                    <div className="flex items-center justify-end text-sm font-bold" style={{ color: source.color }}>
                      {getWinRateImpactText(source.winRate)}
                    </div>
                  </div>

                  {/* Enhanced Scale labels */}
                  <div className="grid grid-cols-4 text-xs text-muted-foreground mb-2">
                    <div className="text-left">Weak</div>
                    <div className="text-center">Moderate</div>
                    <div className="text-center">Strong</div>
                    <div className="text-right">Very Strong</div>
                  </div>

                  {/* Enhanced Progress bar container */}
                  <div className="relative h-4 w-full rounded-full bg-muted/30 overflow-hidden">
                    {/* Percentage text above marker */}
                    <div
                      className="absolute -top-6 text-xs font-bold text-foreground z-10 transform -translate-x-1/2"
                      style={{
                        left: getWinRateWidthPercentage(source.winRate),
                      }}
                    >
                      {source.winRate.toFixed(1)}%
                    </div>

                    {/* Enhanced Progress bar fill with gradient */}
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                      style={{
                        width: getWinRateWidthPercentage(source.winRate),
                        background: `linear-gradient(90deg, ${source.color}40 0%, ${source.color} 100%)`,
                      }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
