"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CorrelationChart({ stocks, weights }) {
  // State to track which chart to display
  const [activeTab, setActiveTab] = useState("sources")

  // Generate correlation data for sources
  const sourceCorrelationData = [
    { name: "Twitter", correlation: 0.68 * weights.twitter },
    { name: "Google Trends", correlation: 0.42 * weights.googleTrends },
    { name: "News", correlation: 0.53 * weights.news },
    { name: "Composite", correlation: weights.twitter * 0.68 + weights.googleTrends * 0.42 + weights.news * 0.53 },
  ]

  // Generate correlation data for stocks
  const stockCorrelationData = stocks.map((stock) => ({
    name: stock.symbol,
    correlation: Number.parseFloat((Math.random() * 0.6 + 0.2).toFixed(2)), // Between 0.2 and 0.8
  }))

  // Generate scatter data for sentiment vs performance
  const scatterData = stocks.map((stock) => {
    const sentiment = Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) // Between -1 and 1
    const performance = Number.parseFloat((sentiment * 5 + (Math.random() * 6 - 3)).toFixed(2)) // Correlated with some noise

    return {
      name: stock.symbol,
      sentiment,
      performance,
      z: 10, // Size
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">Sentiment-Price Correlation</CardTitle>
            <CardDescription>Relationship between sentiment and price movement</CardDescription>
          </div>
          <Tabs defaultValue="sources" value={activeTab} onValueChange={setActiveTab} className="w-[240px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
            </TabsList>

            {/* These TabsContent elements are required for the Tabs component to work properly */}
            <TabsContent value="sources" className="hidden" />
            <TabsContent value="stocks" className="hidden" />
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "sources" ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceCorrelationData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
                <Tooltip
                  formatter={(value) => [value.toFixed(2), "Correlation"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]} barSize={20}>
                  {sourceCorrelationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.correlation > 0.6
                          ? "#10b981"
                          : entry.correlation > 0.4
                            ? "#3b82f6"
                            : entry.correlation > 0.2
                              ? "#f59e0b"
                              : "#ef4444"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  dataKey="sentiment"
                  name="Sentiment"
                  domain={[-1, 1]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  label={{ value: "Sentiment Score", position: "bottom", fill: "#94a3b8" }}
                />
                <YAxis
                  type="number"
                  dataKey="performance"
                  name="Performance"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  label={{ value: "Price Change (%)", angle: -90, position: "left", fill: "#94a3b8" }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                    color: "#f8fafc",
                  }}
                  formatter={(value, name, props) => {
                    if (name === "Sentiment") return [value.toFixed(2), name]
                    if (name === "Performance") return [`${value.toFixed(2)}%`, "Price Change"]
                    return [value, name]
                  }}
                  labelFormatter={(value) => scatterData[value].name}
                />
                <Scatter name="Stocks" data={scatterData} fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.sentiment > 0.3 && entry.performance > 0
                          ? "#10b981"
                          : entry.sentiment < -0.3 && entry.performance < 0
                            ? "#ef4444"
                            : "#f59e0b"
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

