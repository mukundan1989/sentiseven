"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, DollarSign } from "lucide-react"

interface PortfolioData {
  date: string
  value: number
  change: number
  cumulative_return: number
}

export function PortfolioChangeChart() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    fetchPortfolioData()
  }, [timeRange])

  const fetchPortfolioData = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockData: PortfolioData[] = []
      const startDate = new Date()
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90

      for (let i = days; i >= 0; i--) {
        const date = new Date(startDate)
        date.setDate(date.getDate() - i)

        const baseValue = 10000
        const randomChange = (Math.random() - 0.5) * 200
        const value = baseValue + randomChange + (Math.random() * 1000 - 500)
        const change = i === days ? 0 : randomChange
        const cumulative_return = (value - baseValue) / baseValue

        mockData.push({
          date: date.toISOString().split("T")[0],
          value: value,
          change: change,
          cumulative_return: cumulative_return,
        })
      }

      setPortfolioData(mockData)
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{label}</p>
          <p className="text-primary">Value: {formatCurrency(payload[0].value)}</p>
          <p className={payload[0].payload.change >= 0 ? "text-green-500" : "text-red-500"}>
            Change: {payload[0].payload.change >= 0 ? "+" : ""}
            {formatCurrency(payload[0].payload.change)}
          </p>
          <p className="text-muted-foreground">Return: {formatPercentage(payload[0].payload.cumulative_return)}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Portfolio Performance</CardTitle>
          <CardDescription>Loading portfolio data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }

  const latestValue = portfolioData[portfolioData.length - 1]
  const firstValue = portfolioData[0]
  const totalReturn = latestValue && firstValue ? ((latestValue.value - firstValue.value) / firstValue.value) * 100 : 0

  return (
    <Card className="bg-card border-border hover:shadow-glow-cyan transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>Portfolio value changes over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {latestValue && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-card-foreground">{formatCurrency(latestValue.value)}</span>
            </div>
            <div className={`text-sm font-medium ${totalReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalReturn >= 0 ? "+" : ""}
              {totalReturn.toFixed(2)}%
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
