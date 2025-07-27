"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Clock, Target } from "lucide-react"

interface SignalSummary {
  id: string
  source: string
  signal_type: string
  strength: number
  confidence: number
  timestamp: string
  description: string
  impact_score: number
  stock_symbol?: string
}

interface ImpactCardProps {
  signal: SignalSummary
}

export function ImpactCard({ signal }: ImpactCardProps) {
  const getSignalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bullish":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "bearish":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-blue-500" />
    }
  }

  const getSignalColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bullish":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "bearish":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.7) return "text-green-500"
    if (strength >= 0.4) return "text-yellow-500"
    return "text-red-500"
  }

  const getImpactLevel = (score: number) => {
    if (score >= 0.7) return { label: "High", color: "bg-red-500" }
    if (score >= 0.4) return { label: "Medium", color: "bg-yellow-500" }
    return { label: "Low", color: "bg-green-500" }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const impact = getImpactLevel(signal.impact_score)

  return (
    <Card className="bg-card border-border hover:shadow-glow-blue transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getSignalIcon(signal.signal_type)}
            <div>
              <CardTitle className="text-lg text-card-foreground">
                {signal.stock_symbol ? `${signal.stock_symbol} Signal` : "Market Signal"}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                <span>{signal.source}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(signal.timestamp)}</span>
              </CardDescription>
            </div>
          </div>
          <Badge className={getSignalColor(signal.signal_type)}>{signal.signal_type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-card-foreground leading-relaxed">{signal.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Signal Strength</span>
              <span className={`font-medium ${getStrengthColor(signal.strength)}`}>
                {(signal.strength * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={signal.strength * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium text-card-foreground">{(signal.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={signal.confidence * 100} className="h-2" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Impact Level</span>
          </div>
          <Badge className={`${impact.color} text-white`}>{impact.label}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
