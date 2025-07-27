"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Mock data for the dashboard
const mockPerformanceData = [
  { date: "Jan", value: 100, signals: 45 },
  { date: "Feb", value: 120, signals: 52 },
  { date: "Mar", value: 115, signals: 48 },
  { date: "Apr", value: 140, signals: 61 },
  { date: "May", value: 165, signals: 58 },
  { date: "Jun", value: 180, signals: 67 },
]

const mockSignalSummary = {
  total: 1247,
  positive: 687,
  negative: 423,
  neutral: 137,
  accuracy: 78.5,
  winRate: 82.3,
}

const mockTopStocks = [
  { symbol: "AAPL", sentiment: "Positive", score: 0.85, change: 12.5 },
  { symbol: "MSFT", sentiment: "Positive", score: 0.78, change: 8.3 },
  { symbol: "GOOGL", sentiment: "Negative", score: -0.42, change: -5.2 },
  { symbol: "TSLA", sentiment: "Positive", score: 0.91, change: 15.7 },
  { symbol: "META", sentiment: "Neutral", score: 0.12, change: 2.1 },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-electric border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-electric animate-pulse" />
            <h1 className="text-4xl font-bold gradient-text">SentiSeven</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced sentiment analysis dashboard powered by AI-driven insights from multiple data sources
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="glass" className="px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Analysis
            </Badge>
            <Badge variant="purple" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              {mockSignalSummary.accuracy}% Accuracy
            </Badge>
            <Badge variant="default" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              {mockSignalSummary.total} Signals
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signals</CardTitle>
              <BarChart3 className="h-4 w-4 text-electric" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockSignalSummary.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-400">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{mockSignalSummary.winRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-400">+2.3%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Signals</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{mockSignalSummary.positive}</div>
              <p className="text-xs text-muted-foreground">
                {((mockSignalSummary.positive / mockSignalSummary.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Target className="h-4 w-4 text-purple-electric" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-electric">{mockSignalSummary.accuracy}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-400">+1.2%</span> improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-electric" />
              Performance Overview
            </CardTitle>
            <CardDescription>Portfolio performance and signal generation over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--electric-blue))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--electric-blue))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      backdropFilter: "blur(16px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--electric-blue))"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Top Performing Stocks
            </CardTitle>
            <CardDescription>Stocks with the highest sentiment scores and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopStocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-4 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-electric flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">Score: {stock.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        stock.sentiment === "Positive"
                          ? "default"
                          : stock.sentiment === "Negative"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {stock.sentiment}
                    </Badge>
                    <div className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{Math.abs(stock.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-electric" />
                Signal Analysis
              </CardTitle>
              <CardDescription>Explore detailed sentiment signals from multiple sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/google-trend-signals">
                  <Button variant="glass" className="w-full justify-start">
                    Google Trends Signals
                  </Button>
                </Link>
                <Link href="/twitter-signals">
                  <Button variant="glass" className="w-full justify-start">
                    Twitter Signals
                  </Button>
                </Link>
                <Link href="/news-signals">
                  <Button variant="glass" className="w-full justify-start">
                    News Signals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-electric" />
                Portfolio Tools
              </CardTitle>
              <CardDescription>Manage and analyze your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/performance">
                  <Button variant="gradient" className="w-full justify-start">
                    Performance Analysis
                  </Button>
                </Link>
                <Link href="/stock-signal">
                  <Button variant="glass" className="w-full justify-start">
                    Stock Signals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gold-accent" />
                Account
              </CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/profile">
                  <Button variant="glass" className="w-full justify-start">
                    Profile Settings
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="glass" className="w-full justify-start">
                    Preferences
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
