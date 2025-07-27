"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Zap,
  Globe,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock data for charts
const performanceData = [
  { name: "Jan", portfolio: 4000, market: 3800 },
  { name: "Feb", portfolio: 3000, market: 3200 },
  { name: "Mar", portfolio: 5000, market: 4200 },
  { name: "Apr", portfolio: 4500, market: 4100 },
  { name: "May", portfolio: 6000, market: 5200 },
  { name: "Jun", portfolio: 5500, market: 5800 },
]

const sentimentData = [
  { name: "Mon", positive: 65, negative: 35 },
  { name: "Tue", positive: 72, negative: 28 },
  { name: "Wed", positive: 58, negative: 42 },
  { name: "Thu", positive: 81, negative: 19 },
  { name: "Fri", positive: 69, negative: 31 },
  { name: "Sat", positive: 75, negative: 25 },
  { name: "Sun", positive: 78, negative: 22 },
]

const topStocks = [
  { symbol: "AAPL", name: "Apple Inc.", change: 5.2, sentiment: 0.8, price: 175.43 },
  { symbol: "MSFT", name: "Microsoft Corp.", change: 3.1, sentiment: 0.6, price: 325.76 },
  { symbol: "GOOGL", name: "Alphabet Inc.", change: -1.2, sentiment: -0.3, price: 132.58 },
  { symbol: "AMZN", name: "Amazon.com Inc.", change: 2.8, sentiment: 0.4, price: 145.68 },
  { symbol: "TSLA", name: "Tesla Inc.", change: 8.5, sentiment: 0.9, price: 238.45 },
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div
              className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-electric-blue-200 to-purple-200 bg-clip-text text-transparent">
                Sentiment-Driven
                <span className="block bg-gradient-to-r from-electric-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Trading Intelligence
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto mt-6">
                Harness the power of AI-driven sentiment analysis to make smarter investment decisions. Track market
                sentiment across Twitter, Google Trends, and news sources in real-time.
              </p>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Button variant="electric" size="lg" className="group">
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started
              </Button>
              <Button variant="glass" size="lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-electric-blue-400 group-hover:text-electric-blue-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$45,231.89</div>
              <div className="flex items-center text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +20.1% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Active Signals</CardTitle>
              <Activity className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2,350</div>
              <div className="flex items-center text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +180 new today
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-gold-400 group-hover:text-gold-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">73.2%</div>
              <div className="flex items-center text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.1% this week
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Sentiment Score</CardTitle>
              <Zap className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+0.68</div>
              <div className="flex items-center text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Bullish sentiment
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-electric-blue-400" />
                Portfolio Performance
              </CardTitle>
              <CardDescription>Your portfolio vs market performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#portfolioGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="market"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#marketGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Sentiment Analysis
              </CardTitle>
              <CardDescription>Daily sentiment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gold-400" />
              Top Performing Stocks
            </CardTitle>
            <CardDescription>Stocks with highest sentiment scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{stock.symbol}</div>
                      <div className="text-sm text-white/60">{stock.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-white">${stock.price}</div>
                      <div
                        className={`text-sm flex items-center ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change}%
                      </div>
                    </div>
                    <Badge
                      variant={stock.sentiment > 0.5 ? "success" : stock.sentiment > 0 ? "warning" : "destructive"}
                    >
                      {stock.sentiment > 0 ? "+" : ""}
                      {stock.sentiment.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-electric-blue-500 to-electric-blue-600">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">View Signals</h3>
                  <p className="text-sm text-white/60">Explore latest market signals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics</h3>
                  <p className="text-sm text-white/60">Deep dive into performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Community</h3>
                  <p className="text-sm text-white/60">Connect with other traders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
