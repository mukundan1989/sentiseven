"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, TrendingUp, MessageSquare, Search, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SignalData {
  date: string
  comp_symbol: string
  sentiment_score: number
  sentiment: string
  entry_price: number
}

interface ModelAccuracy {
  modelName: string
  icon: React.ReactNode
  color: string
  totalSignals: number
  correctSignals: number
  accuracy: number
  details: {
    symbol: string
    sentiment: string
    entryPrice: number
    currentPrice: number
    percentChange: number
    isCorrect: boolean
  }[]
}

export function ModelAccuracy() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modelAccuracies, setModelAccuracies] = useState<ModelAccuracy[]>([])

  // Mock current prices for demo purposes
  const mockCurrentPrices: Record<string, number> = {
    AAPL: 175.43 * 1.05, // Up 5%
    MSFT: 325.76 * 1.03, // Up 3%
    GOOGL: 132.58 * 0.97, // Down 3%
    AMZN: 145.68 * 1.08, // Up 8%
    META: 302.55 * 0.95, // Down 5%
    TSLA: 238.45 * 1.12, // Up 12%
    NVDA: 437.92 * 1.15, // Up 15%
    NFLX: 412.34 * 0.92, // Down 8%
    JPM: 145.23 * 1.01, // Up 1%
    V: 235.67 * 0.99, // Down 1%
    GRPN: 26.6 * 0.85, // Down 15%
    APRN: 75.2 * 1.2, // Up 20%
  }

  // Get current price for a stock
  const getCurrentPrice = (symbol: string, entryPrice: number): number => {
    if (mockCurrentPrices[symbol]) {
      return mockCurrentPrices[symbol]
    }

    // Generate a consistent price change based on the symbol
    const symbolSum = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const changeDirection = symbolSum % 2 === 0 ? 1 : -1
    const changePercent = (symbolSum % 20) / 100 // 0-19% change

    return entryPrice * (1 + changeDirection * changePercent)
  }

  // Check if a signal was correct
  const isSignalCorrect = (sentiment: string, percentChange: number): boolean => {
    if (sentiment.toLowerCase() === "positive" && percentChange > 0) {
      return true
    }
    if (sentiment.toLowerCase() === "negative" && percentChange < 0) {
      return true
    }
    if (sentiment.toLowerCase() === "neutral") {
      return Math.abs(percentChange) < 3 // Consider neutral correct if change is small
    }
    return false
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch data from all three signal APIs
        const [googleRes, twitterRes, newsRes] = await Promise.all([
          fetch("/api/gtrend-signals"),
          fetch("/api/twitter-signals"),
          fetch("/api/news-signals"),
        ])

        if (!googleRes.ok || !twitterRes.ok || !newsRes.ok) {
          throw new Error("Failed to fetch signal data")
        }

        const [googleData, twitterData, newsData] = await Promise.all([
          googleRes.json(),
          twitterRes.json(),
          newsRes.json(),
        ])

        // Process Google Trends data
        const googleAccuracy = processModelData(
          googleData,
          "Google Trends",
          <Search className="h-4 w-4" />,
          "bg-blue-500",
        )

        // Process Twitter data
        const twitterAccuracy = processModelData(
          twitterData,
          "Twitter",
          <MessageSquare className="h-4 w-4" />,
          "bg-sky-400",
        )

        // Process News data
        const newsAccuracy = processModelData(newsData, "News", <TrendingUp className="h-4 w-4" />, "bg-emerald-500")

        setModelAccuracies([googleAccuracy, twitterAccuracy, newsAccuracy])
      } catch (err: any) {
        console.error("Error fetching model accuracy data:", err)
        setError(err.message || "Failed to fetch model accuracy data")
      } finally {
        setLoading(false)
      }
    }

    // Process data for a specific model
    const processModelData = (
      data: SignalData[],
      modelName: string,
      icon: React.ReactNode,
      color: string,
    ): ModelAccuracy => {
      // Group by symbol and get the latest signal for each
      const latestSignals = new Map<string, SignalData>()

      // Defensive check for data
      if (data) {
        data.forEach((signal) => {
          const existingSignal = latestSignals.get(signal.comp_symbol)
          if (!existingSignal || new Date(signal.date) > new Date(existingSignal.date)) {
            latestSignals.set(signal.comp_symbol, signal)
          }
        })
      }

      // Calculate accuracy for each signal
      let correctCount = 0
      const details = []

      for (const signal of latestSignals.values()) {
        const currentPrice = getCurrentPrice(signal.comp_symbol, signal.entry_price)
        const percentChange = ((currentPrice - signal.entry_price) / signal.entry_price) * 100
        const correct = isSignalCorrect(signal.sentiment, percentChange)

        if (correct) {
          correctCount++
        }

        details.push({
          symbol: signal.comp_symbol,
          sentiment: signal.sentiment,
          entryPrice: signal.entry_price,
          currentPrice,
          percentChange,
          isCorrect: correct,
        })
      }

      const totalSignals = latestSignals.size
      const accuracy = totalSignals > 0 ? (correctCount / totalSignals) * 100 : 0

      return {
        modelName,
        icon,
        color,
        totalSignals,
        correctSignals: correctCount,
        accuracy,
        details,
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sentiment-Price Correlation</CardTitle>
        <CardDescription>Accuracy of each model's latest signals in predicting price movements</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Analyzing model accuracy...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">{error}</div>
        ) : (
          <div className="space-y-6">
            {modelAccuracies &&
              modelAccuracies.map(
                (
                  model, // Defensive check
                ) => (
                  <div key={model.modelName} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${model.color}`}>{model.icon}</div>
                        <span className="font-medium">{model.modelName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {model.correctSignals} of {model.totalSignals} correct
                        </span>
                        <Badge variant={model.accuracy >= 60 ? "default" : "outline"}>
                          {model.accuracy.toFixed(1)}% accurate
                        </Badge>
                      </div>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {model.details &&
                        model.details.slice(0, 6).map(
                          (
                            detail, // Defensive check
                          ) => (
                            <div
                              key={detail.symbol}
                              className={`text-xs p-2 rounded-md border flex justify-between items-center
                        ${
                          detail.isCorrect
                            ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
                            : "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
                        }`}
                            >
                              <div>
                                <span className="font-medium">{detail.symbol}</span>
                                <span
                                  className={`ml-2 px-1.5 py-0.5 rounded text-xs
                          ${
                            detail.sentiment.toLowerCase() === "positive"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : detail.sentiment.toLowerCase() === "negative"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                                >
                                  {detail.sentiment}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={detail.percentChange >= 0 ? "text-green-600" : "text-red-600"}>
                                  {detail.percentChange >= 0 ? "+" : ""}
                                  {detail.percentChange.toFixed(1)}%
                                </span>
                                {detail.isCorrect ? (
                                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      {model.details &&
                        model.details.length > 6 && ( // Defensive check
                          <div className="text-xs p-2 rounded-md border border-dashed border-muted-foreground/30 flex justify-center items-center">
                            +{model.details.length - 6} more stocks
                          </div>
                        )}
                    </div>
                  </div>
                ),
              )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
