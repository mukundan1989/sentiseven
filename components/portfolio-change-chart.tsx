"use client"

import { useState } from "react"
import {
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PortfolioChangeChart({ stocks, timePeriod }) {
  // Generate portfolio change data
  const portfolioData = generatePortfolioData(stocks, timePeriod)

  // Generate contribution data
  const contributionData = generateContributionData(stocks, timePeriod)

  // State to track which chart to display
  const [activeTab, setActiveTab] = useState("cumulative")

  return (
    <Card className="glass-morphism border-border/50 shadow-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Portfolio Performance
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Portfolio sentiment changes over time with individual stock contributions
            </CardDescription>
          </div>
          <Tabs defaultValue="cumulative" value={activeTab} onValueChange={setActiveTab} className="w-[280px]">
            <TabsList className="grid grid-cols-2 bg-card/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger
                value="cumulative"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Cumulative
              </TabsTrigger>
              <TabsTrigger
                value="contribution"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Contribution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cumulative" className="hidden" />
            <TabsContent value="contribution" className="hidden" />
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "cumulative" ? (
              <ComposedChart data={portfolioData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                  formatter={(value) => [`${value.toFixed(2)}%`, "Portfolio Change"]}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="portfolioChange"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#portfolioGradient)"
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={contributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                  formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Legend
                  wrapperStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                {stocks.map((stock, index) => (
                  <Bar
                    key={stock.symbol}
                    dataKey={stock.symbol}
                    stackId="a"
                    fill={
                      [
                        "hsl(217 91% 60%)", // Electric blue
                        "hsl(180 100% 70%)", // Cyan
                        "hsl(280 100% 70%)", // Purple
                        "hsl(45 100% 60%)", // Gold
                        "hsl(340 100% 70%)", // Pink
                        "hsl(160 60% 45%)", // Teal
                        "hsl(30 80% 55%)", // Orange
                        "hsl(120 60% 50%)", // Green
                        "hsl(260 65% 60%)", // Violet
                        "hsl(15 75% 55%)", // Red-orange
                      ][index % 10]
                    }
                  />
                ))}
                <Line type="monotone" dataKey="Total" stroke="hsl(var(--foreground))" strokeWidth={3} dot={false} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate portfolio data
function generatePortfolioData(stocks, timePeriod) {
  const data = []
  const days = timePeriod === "1d" ? 24 : timePeriod === "1w" ? 7 : 30
  const now = new Date()
  let cumulativeChange = 0

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    if (timePeriod === "1d") {
      date.setHours(date.getHours() - i)
      date.setMinutes(0)
    } else {
      date.setDate(date.getDate() - i)
    }

    // Format date
    const formattedDate = timePeriod === "1d" ? `${date.getHours()}:00` : `${date.getMonth() + 1}/${date.getDate()}`

    // Add some randomness to portfolio change
    const dailyChange = Math.random() * 2 - 0.5 // Between -0.5% and 1.5%
    cumulativeChange += dailyChange

    data.push({
      date: formattedDate,
      portfolioChange: Number.parseFloat(cumulativeChange.toFixed(2)),
    })
  }

  return data
}

// Helper function to generate contribution data
function generateContributionData(stocks, timePeriod) {
  const data = []
  const days = timePeriod === "1d" ? 24 : timePeriod === "1w" ? 7 : 30
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    if (timePeriod === "1d") {
      date.setHours(date.getHours() - i)
      date.setMinutes(0)
    } else {
      date.setDate(date.getDate() - i)
    }

    // Format date
    const formattedDate = timePeriod === "1d" ? `${date.getHours()}:00` : `${date.getMonth() + 1}/${date.getDate()}`

    // Create data point with contributions from each stock
    const dataPoint = { date: formattedDate }
    let total = 0

    stocks.forEach((stock) => {
      const contribution = (Math.random() * 2 - 1) * 0.5 // Between -0.5% and 0.5%
      dataPoint[stock.symbol] = Number.parseFloat(contribution.toFixed(2))
      total += contribution
    })

    dataPoint.Total = Number.parseFloat(total.toFixed(2))
    data.push(dataPoint)
  }

  return data
}
