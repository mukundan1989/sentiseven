"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, DollarSign, TrendingUp, Search } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

export default function PerformancePage() {
  const [symbol, setSymbol] = useState("APRN")
  const [metrics, setMetrics] = useState<any>(null)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [cumulativePL, setCumulativePL] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!symbol) return

    setLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      const [metricsRes, dataRes, plRes] = await Promise.all([
        fetch(`/api/performance?symbol=${symbol}&type=metrics`),
        fetch(`/api/performance?symbol=${symbol}&type=data`),
        fetch(`/api/performance?symbol=${symbol}&type=cumulative-pl`),
      ])

      if (!metricsRes.ok) throw new Error("Failed to fetch metrics")
      if (!dataRes.ok) throw new Error("Failed to fetch performance data")
      if (!plRes.ok) throw new Error("Failed to fetch cumulative P/L")

      const [metricsData, performanceData, plData] = await Promise.all([
        metricsRes.json(),
        dataRes.json(),
        plRes.json(),
      ])

      setMetrics(metricsData)
      setPerformanceData(performanceData)
      setCumulativePL(plData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Performance Summary</h1>
          <p className="text-gray-400 mt-1">View performance metrics for stock trading models</p>
        </div>

        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1 max-w-xs relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter Stock Symbol"
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Analyze
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
            <CardContent className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error}</div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 mr-2 text-blue-600" />
                <span className="text-gray-600">Loading performance data...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {metrics && (
              <>
                <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
                    <CardDescription className="text-gray-500">Key performance indicators for {symbol}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start">
                          <div className="rounded-full bg-green-100 p-3 mr-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 uppercase">Win %</p>
                            <h3
                              className={`text-3xl font-bold ${Number(metrics.win_percentage) >= 50 ? "text-green-600" : "text-red-600"}`}
                            >
                              {metrics.win_percentage}%
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start">
                          <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 uppercase">Total Trades</p>
                            <h3 className="text-3xl font-bold text-gray-900">{metrics.total_trades}</h3>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start">
                          <div className="rounded-full bg-amber-100 p-3 mr-4">
                            <DollarSign className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 uppercase">Profit Factor</p>
                            <h3
                              className={`text-3xl font-bold ${Number(metrics.profit_factor) > 1 ? "text-green-600" : "text-red-600"}`}
                            >
                              {metrics.profit_factor}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {cumulativePL && cumulativePL.length > 0 && (
              <>
                <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Equity Curve</CardTitle>
                    <CardDescription className="text-gray-500">
                      Cumulative profit/loss over time for {symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cumulativePL} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                          <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderColor: "#e5e7eb",
                              borderRadius: "0.375rem",
                            }}
                            formatter={(value) => [`${value.toFixed(2)}`, "Cumulative P/L"]}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <ReferenceLine y={0} stroke="#6b7280" />
                          <Line
                            type="monotone"
                            dataKey="cumulative_pl"
                            stroke={cumulativePL[cumulativePL.length - 1]?.cumulative_pl > 0 ? "#10b981" : "#ef4444"}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Cumulative P/L"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {performanceData && performanceData.length > 0 && (
              <>
                <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance Data Table</CardTitle>
                    <CardDescription className="text-gray-500">
                      Detailed trade history and performance for {symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Sentiment</th>
                            <th className="px-6 py-4 font-medium text-right">Entry Price</th>
                            <th className="px-6 py-4 font-medium text-right">30D P/L</th>
                            <th className="px-6 py-4 font-medium text-right">60D P/L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.map((row, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-gray-800">{row.date}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                                    ${
                                      row.sentiment.toLowerCase() === "positive"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : row.sentiment.toLowerCase() === "negative"
                                          ? "bg-red-100 text-red-800 border border-red-200"
                                          : "bg-amber-100 text-amber-800 border border-amber-200"
                                    }`}
                                >
                                  {row.sentiment}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-medium text-gray-900">
                                ${Number(row.entry_price).toFixed(2)}
                              </td>
                              <td
                                className={`px-6 py-4 text-right font-medium ${Number(row["30d_pl"]) >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {Number(row["30d_pl"]) >= 0 ? "+" : ""}
                                {Number(row["30d_pl"]).toFixed(2)}
                              </td>
                              <td
                                className={`px-6 py-4 text-right font-medium ${Number(row["60d_pl"]) >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {Number(row["60d_pl"]) >= 0 ? "+" : ""}
                                {Number(row["60d_pl"]).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
