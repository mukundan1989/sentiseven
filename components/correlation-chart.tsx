"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface CorrelationData {
  source_pair: string
  correlation: number
  significance: number
  trend: "up" | "down" | "stable"
}

export function CorrelationChart() {
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    const fetchCorrelationData = async () => {
      try {
        // Mock data for demonstration
        const mockData: CorrelationData[] = [
          { source_pair: "Twitter vs News", correlation: 0.78, significance: 0.95, trend: "up" },
          { source_pair: "Google Trends vs Twitter", correlation: 0.65, significance: 0.87, trend: "stable" },
          { source_pair: "News vs Google Trends", correlation: 0.52, significance: 0.73, trend: "down" },
          { source_pair: "Reddit vs Twitter", correlation: 0.71, significance: 0.89, trend: "up" },
          { source_pair: "Reddit vs News", correlation: 0.43, significance: 0.68, trend: "stable" },
        ]

        setCorrelationData(mockData)
      } catch (error) {
        console.error("Error fetching correlation data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCorrelationData()
  }, [])

  const getCorrelationColor = (correlation: number) => {
    const absCorr = Math.abs(correlation)
    if (absCorr >= 0.7) return "text-green-500"
    if (absCorr >= 0.5) return "text-yellow-500"
    return "text-red-500"
  }

  const getCorrelationStrength = (correlation: number) => {
    const absCorr = Math.abs(correlation)
    if (absCorr >= 0.7) return "Strong"
    if (absCorr >= 0.5) return "Moderate"
    return "Weak"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Source Correlation</CardTitle>
          <CardDescription>Loading correlation analysis...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border hover:shadow-glow-blue transition-shadow">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Source Correlation
        </CardTitle>
        <CardDescription>Correlation strength between different sentiment data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {correlationData.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-card-foreground">{item.source_pair}</span>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getCorrelationColor(item.correlation)}>
                    {getCorrelationStrength(item.correlation)}
                  </Badge>
                  <span className={`text-sm font-medium ${getCorrelationColor(item.correlation)}`}>
                    {item.correlation.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Progress value={Math.abs(item.correlation) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Correlation Strength</span>
                  <span>Significance: {(item.significance * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Strong (≥0.7):</strong> High correlation between sources
            </p>
            <p>
              <strong>Moderate (0.5-0.7):</strong> Moderate correlation
            </p>
            <p>
              <strong>Weak (&lt;0.5):</strong> Low correlation between sources
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
