"use client"

import { useEffect, useState, useRef } from "react"
import { Search, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"

interface TwitterSignal {
  date: string
  comp_symbol: string
  analyzed_tweets: number
  sentiment_score: number
  sentiment: string
  entry_price: number
}

interface StockPrice {
  symbol: string
  price: number
  source?: string
}

export default function TwitterSignalsPage() {
  const [data, setData] = useState<TwitterSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<TwitterSignal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    lastUpdate: "",
    totalTweets: 0,
    wins: 0, // New
    losses: 0, // New
    winRate: 0, // New
  })

  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({})
  const [pricesLoading, setPricesLoading] = useState(false)

  // Fetch current prices for all symbols using the new batch API
  const fetchCurrentPrices = async (symbols: string[]) => {
    setPricesLoading(true)
    const prices: Record<string, number> = {}

    if (symbols.length === 0) {
      setPricesLoading(false)
      return
    }

    try {
      const res = await fetch("/api/stock-price/current/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbols }),
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch current prices: ${res.statusText}`)
      }

      const data = await res.json() // data will be an object like {AAPL: 175.43, MSFT: 325.76}
      Object.assign(prices, data) // Merge fetched prices into the prices object
    } catch (error) {
      console.error("Failed to get current prices in batch:", error)
      // Optionally, set all prices to 0 or a fallback if batch fails
      symbols.forEach((symbol) => (prices[symbol] = 0))
    }

    setCurrentPrices(prices)
    setPricesLoading(false)
  }

  // Helper function to format dates safely
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"

    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString

      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid Date"

      return date.toISOString().split("T")[0] // Returns YYYY-MM-DD
    } catch (e) {
      console.error("Date formatting error:", e)
      return "Invalid Date"
    }
  }

  // Helper function to safely get number value
  const safeNumber = (value: any, defaultValue = 0): number => {
    if (value === null || value === undefined) return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  // Helper function to safely get string value
  const safeString = (value: any, defaultValue = ""): string => {
    if (value === null || value === undefined) return defaultValue
    return String(value)
  }

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        console.log("Fetching Twitter signals...")
        const res = await fetch("/api/twitter-signals")
        console.log("Response status:", res.status)

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`API returned ${res.status}: ${errorText}`)
        }

        const rawData = await res.json()
        console.log("Raw Twitter signals data:", rawData)

        if (!Array.isArray(rawData)) {
          throw new Error("Invalid data format received from API")
        }

        // Safely process the data
        const processedData = rawData.map((item: any, index: number) => {
          try {
            return {
              date: formatDate(item.date),
              comp_symbol: safeString(item.comp_symbol, `UNKNOWN_${index}`),
              analyzed_tweets: safeNumber(item.analyzed_tweets, 0),
              sentiment_score: safeNumber(item.sentiment_score, 0),
              sentiment: safeString(item.sentiment, "neutral"),
              entry_price: safeNumber(item.entry_price, 0),
            }
          } catch (itemError) {
            console.error("Error processing item:", item, itemError)
            return {
              date: "Invalid Date",
              comp_symbol: `ERROR_${index}`,
              analyzed_tweets: 0,
              sentiment_score: 0,
              sentiment: "neutral",
              entry_price: 0,
            }
          }
        })

        setData(processedData)
        setFilteredData(processedData)

        // Generate summary stats safely
        try {
          const stats = {
            total: processedData.length,
            positive: processedData.filter(
              (item: TwitterSignal) => safeString(item.sentiment).toLowerCase() === "positive",
            ).length,
            negative: processedData.filter(
              (item: TwitterSignal) => safeString(item.sentiment).toLowerCase() === "negative",
            ).length,
            neutral: processedData.filter(
              (item: TwitterSignal) => safeString(item.sentiment).toLowerCase() === "neutral",
            ).length,
            lastUpdate: processedData.length > 0 ? processedData[0].date : "N/A",
            totalTweets: processedData.reduce(
              (sum: number, item: TwitterSignal) => sum + safeNumber(item.analyzed_tweets, 0),
              0,
            ),
            wins: 0, // Will be calculated in a separate useEffect
            losses: 0, // Will be calculated in a separate useEffect
            winRate: 0, // Will be calculated in a separate useEffect
          }
          setSummaryStats(stats)
        } catch (statsError) {
          console.error("Error generating stats:", statsError)
          setSummaryStats({
            total: 0,
            positive: 0,
            negative: 0,
            neutral: 0,
            lastUpdate: "N/A",
            totalTweets: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
          })
        }
      } catch (err: any) {
        console.error("Error fetching Twitter signals:", err)
        setError(`Failed to load Twitter Signals: ${err.message || "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const uniqueSymbols = [...new Set(data.map((item) => item.comp_symbol))]
      console.log(`Found ${uniqueSymbols.length} unique symbols:`, uniqueSymbols)
      fetchCurrentPrices(uniqueSymbols)
    }
  }, [data])

  // New useEffect to calculate Win Rate
  useEffect(() => {
    if (filteredData.length > 0 && !pricesLoading) {
      let wins = 0
      let losses = 0

      filteredData.forEach((signal) => {
        const currentPrice = currentPrices[signal.comp_symbol] || 0
        const entryPrice = safeNumber(signal.entry_price)

        if (entryPrice === 0) return // Cannot calculate P/L if entry price is 0

        if (safeString(signal.sentiment).toLowerCase() === "positive") {
          if (currentPrice >= entryPrice) {
            wins++
          } else {
            losses++
          }
        } else if (safeString(signal.sentiment).toLowerCase() === "negative") {
          if (currentPrice <= entryPrice) {
            wins++
          } else {
            losses++
          }
        }
        // Neutral signals are ignored for win/loss calculation
      })

      const totalTrades = wins + losses
      const calculatedWinRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0

      setSummaryStats((prevStats) => ({
        ...prevStats,
        wins,
        losses,
        winRate: calculatedWinRate,
      }))
    }
  }, [filteredData, currentPrices, pricesLoading])

  // Effect to send summary stats to the server after a delay
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    console.log("TwitterSignalsPage: useEffect for sending summary stats triggered.")
    console.log(
      "TwitterSignalsPage: Conditions - filteredData.length:",
      filteredData.length,
      "pricesLoading:",
      pricesLoading,
      "summaryStats.total:",
      summaryStats.total,
    )
    if (filteredData.length > 0 && !pricesLoading && summaryStats.total > 0) {
      // Clear any existing timeout to avoid sending stale data
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      console.log("TwitterSignalsPage: Conditions met. Setting timeout for summary upload.")
      timeoutRef.current = setTimeout(async () => {
        console.log("TwitterSignalsPage: 60-second timeout elapsed. Sending summary data...")
        try {
          const positiveRatio =
            summaryStats.negative > 0
              ? summaryStats.positive / summaryStats.negative
              : summaryStats.positive > 0
                ? null // Send null if negative is 0 and positive is > 0 (representing Infinity)
                : 0 // Send 0 if both are 0

          const response = await fetch("/api/signal-summaries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              signal_type: "twitter",
              total_signals: summaryStats.total,
              positive_ratio: positiveRatio,
              win_rate_percent: summaryStats.winRate,
              positive_signals: summaryStats.positive,
              negative_signals: summaryStats.negative,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error(
              "TwitterSignalsPage: Failed to save Twitter signal summary:",
              errorData.error,
              response.status,
            )
          } else {
            console.log("TwitterSignalsPage: Twitter signal summary saved successfully!")
          }
        } catch (error) {
          console.error("Error sending Twitter signal summary:", error)
        }
      }, 60000) // 60 seconds delay
    }

    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [filteredData, pricesLoading, summaryStats])

  useEffect(() => {
    try {
      // Apply filters and sorting safely
      let result = [...data]

      // Apply sentiment filter
      if (sentimentFilter !== "all") {
        result = result.filter((item) => safeString(item.sentiment).toLowerCase() === sentimentFilter.toLowerCase())
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        result = result.filter((item) => safeString(item.comp_symbol).toLowerCase().includes(query))
      }

      // Apply sorting
      result.sort((a, b) => {
        try {
          if (sortBy === "date") {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getTime() - dateB.getTime()
          } else if (sortBy === "symbol") {
            return safeString(a.comp_symbol).localeCompare(safeString(b.comp_symbol))
          } else if (sortBy === "sentiment_score") {
            return safeNumber(a.sentiment_score) - safeNumber(b.sentiment_score)
          } else if (sortBy === "tweets") {
            return safeNumber(a.analyzed_tweets) - safeNumber(b.analyzed_tweets)
          }
          return 0
        } catch (sortError) {
          console.error("Sorting error:", sortError)
          return 0
        }
      })

      // Apply sort order
      if (sortOrder === "desc") {
        result.reverse()
      }

      setFilteredData(result)
    } catch (filterError) {
      console.error("Filtering error:", filterError)
      setFilteredData([])
    }
  }, [data, searchQuery, sentimentFilter, sortBy, sortOrder])

  // Generate comparison data safely
  const comparisonData = [
    { symbol: "AAPL", googleTrends: 0.5, twitter: 0.7, news: 0.6 },
    { symbol: "MSFT", googleTrends: 0.6, twitter: 0.7, news: 0.5 },
    { symbol: "AMZN", googleTrends: 0.4, twitter: 0.3, news: 0.2 },
    { symbol: "GOOGL", googleTrends: 0.6, twitter: 0.8, news: 0.7 },
    { symbol: "META", googleTrends: -0.3, twitter: -0.2, news: -0.1 },
    { symbol: "TSLA", googleTrends: 0.3, twitter: 0.4, news: 0.5 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with premium styling */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">Twitter Signals</h1>
          <p className="text-muted-foreground text-lg">Real-time sentiment analysis from Twitter conversations</p>
        </div>

        {/* Summary Stats Card with glass morphism */}
        <div className="glass-card rounded-2xl p-6 mb-8 shadow-glow-blue">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Total Signals</span>
              <span className="text-2xl font-bold text-gradient">{summaryStats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Analyzed Tweets</span>
              <span className="text-2xl font-bold text-gradient-secondary">
                {summaryStats.totalTweets.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Win Rate</span>
              <span className="text-2xl font-bold text-gradient-accent">{summaryStats.winRate.toFixed(2)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Positive</span>
              <span className="text-2xl font-bold text-green-400">{summaryStats.positive}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Negative</span>
              <span className="text-2xl font-bold text-red-400">{summaryStats.negative}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-muted-foreground text-sm">Last updated: {summaryStats.lastUpdate}</span>
          </div>
        </div>

        {/* Filters Card with premium styling */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by symbol..."
                  className="pl-10 bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="symbol">Symbol</SelectItem>
                  <SelectItem value="sentiment_score">Sentiment Score</SelectItem>
                  <SelectItem value="tweets">Analyzed Tweets</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Table Card with premium styling */}
        <div className="glass-card rounded-2xl overflow-hidden mb-8 shadow-premium">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner w-8 h-8 rounded-full mr-3"></div>
              <span className="text-muted-foreground">Loading sentiment data...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <p className="text-red-400 text-center">{error}</p>
              <Button onClick={() => window.location.reload()} className="btn-gradient-primary">
                Retry
              </Button>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Symbol</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Tweets</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Score</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Sentiment</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Entry</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Current</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">P/L%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((signal, i) => {
                    const currentPrice = currentPrices[signal.comp_symbol] || 0
                    const entryPrice = safeNumber(signal.entry_price)
                    let pLPercentage: number | null = null
                    let changeColorClass = ""

                    if (safeString(signal.sentiment).toLowerCase() === "positive") {
                      if (entryPrice !== 0) {
                        pLPercentage = ((currentPrice - entryPrice) / entryPrice) * 100
                      }
                    } else if (safeString(signal.sentiment).toLowerCase() === "negative") {
                      if (entryPrice !== 0) {
                        pLPercentage = ((entryPrice - currentPrice) / entryPrice) * 100
                      }
                    }

                    if (pLPercentage !== null) {
                      changeColorClass = pLPercentage > 0 ? "text-green-400" : pLPercentage < 0 ? "text-red-400" : ""
                    }

                    return (
                      <tr
                        key={`${signal.comp_symbol}-${signal.date}-${i}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-foreground">{signal.date}</td>
                        <td className="px-6 py-4 font-medium text-gradient">{signal.comp_symbol}</td>
                        <td className="px-6 py-4 text-right text-foreground">{signal.analyzed_tweets}</td>
                        <td className="px-6 py-4 text-right text-foreground">
                          {safeNumber(signal.sentiment_score).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              safeString(signal.sentiment).toLowerCase() === "positive"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : safeString(signal.sentiment).toLowerCase() === "negative"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {signal.sentiment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-foreground">
                          ${safeNumber(signal.entry_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-foreground">
                          {pricesLoading ? (
                            <div className="loading-spinner w-4 h-4 rounded-full inline-block"></div>
                          ) : (
                            `$${(currentPrices[signal.comp_symbol] || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${changeColorClass}`}>
                          {pLPercentage !== null ? `${pLPercentage.toFixed(2)}%` : "N/A"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No Twitter signals found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Chart Card with premium styling */}
        <div className="glass-card rounded-2xl p-6 shadow-glow-purple">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-gradient">Signal Source Comparison</h2>
          </div>
          <p className="text-muted-foreground mb-6">Compare Twitter with Google Trends and News signals</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="symbol"
                  stroke="hsl(var(--muted-foreground))"
                  className="fill-muted-foreground text-sm"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  className="fill-muted-foreground text-sm"
                  domain={[-1, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                    backdropFilter: "blur(20px)",
                  }}
                  formatter={(value: any) => [Number(value).toFixed(2), "Sentiment Score"]}
                />
                <Legend />
                <Bar dataKey="googleTrends" name="Google Trends" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="twitter" name="Twitter" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="news" name="News" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
