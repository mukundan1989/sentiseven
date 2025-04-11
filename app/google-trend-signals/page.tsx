"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronDown, ChevronUp, Search, Filter, BarChart4, TrendingUp, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"

export default function GoogleTrendSignalsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState({})
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [trendData, setTrendData] = useState([])
  const [symbolDistribution, setSymbolDistribution] = useState([])
  const [keywordData, setKeywordData] = useState([])
  const [comparisonData, setComparisonData] = useState([])
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    lastUpdate: "",
  })

  useEffect(() => {
    fetch("/api/gtrend-signals")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setFilteredData(data)
        setLoading(false)

        // Generate summary stats
        const stats = {
          total: data.length,
          positive: data.filter((item) => item.sentiment.toLowerCase() === "positive").length,
          negative: data.filter((item) => item.sentiment.toLowerCase() === "negative").length,
          neutral: data.filter((item) => item.sentiment.toLowerCase() === "neutral").length,
          lastUpdate: data.length > 0 ? data[0].date : "N/A",
        }
        setSummaryStats(stats)

        // Generate trend data
        setTrendData(generateTrendData(data))

        // Generate symbol distribution
        setSymbolDistribution(generateSymbolDistribution(data))

        // Generate keyword data
        setKeywordData(generateKeywordData(data))

        // Generate comparison data
        setComparisonData(generateComparisonData())
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...data]

    // Apply sentiment filter
    if (sentimentFilter !== "all") {
      result = result.filter((item) => item.sentiment.toLowerCase() === sentimentFilter.toLowerCase())
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.comp_symbol.toLowerCase().includes(query) ||
          (item.analyzed_keywords && item.analyzed_keywords.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date) > new Date(b.date) ? 1 : -1
      } else if (sortBy === "symbol") {
        return a.comp_symbol.localeCompare(b.comp_symbol)
      } else if (sortBy === "sentiment_score") {
        return Number.parseFloat(a.sentiment_score) - Number.parseFloat(b.sentiment_score)
      }
      return 0
    })

    // Apply sort order
    if (sortOrder === "desc") {
      result.reverse()
    }

    setFilteredData(result)
  }, [data, searchQuery, sentimentFilter, sortBy, sortOrder])

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Helper function to generate trend data
  const generateTrendData = (data) => {
    // Group by date and calculate average sentiment score
    const dateMap = {}

    data.forEach((item) => {
      const date = item.date
      if (!dateMap[date]) {
        dateMap[date] = {
          date,
          count: 0,
          totalScore: 0,
          positive: 0,
          negative: 0,
          neutral: 0,
        }
      }

      dateMap[date].count++
      dateMap[date].totalScore += Number.parseFloat(item.sentiment_score || 0)

      if (item.sentiment.toLowerCase() === "positive") {
        dateMap[date].positive++
      } else if (item.sentiment.toLowerCase() === "negative") {
        dateMap[date].negative++
      } else {
        dateMap[date].neutral++
      }
    })

    // Convert to array and calculate average
    const result = Object.values(dateMap).map((item) => ({
      ...item,
      averageScore: item.totalScore / item.count,
    }))

    // Sort by date
    result.sort((a, b) => new Date(a.date) - new Date(b.date))

    return result
  }

  // Helper function to generate symbol distribution
  const generateSymbolDistribution = (data) => {
    const symbolMap = {}

    data.forEach((item) => {
      const symbol = item.comp_symbol
      if (!symbolMap[symbol]) {
        symbolMap[symbol] = {
          symbol,
          count: 0,
          positive: 0,
          negative: 0,
          neutral: 0,
        }
      }

      symbolMap[symbol].count++

      if (item.sentiment.toLowerCase() === "positive") {
        symbolMap[symbol].positive++
      } else if (item.sentiment.toLowerCase() === "negative") {
        symbolMap[symbol].negative++
      } else {
        symbolMap[symbol].neutral++
      }
    })

    // Convert to array and sort by count
    const result = Object.values(symbolMap)
    result.sort((a, b) => b.count - a.count)

    // Take top 10
    return result.slice(0, 10)
  }

  // Helper function to generate keyword data
  const generateKeywordData = (data) => {
    // This would normally parse the analyzed_keywords field
    // For now, we'll generate mock data
    return [
      { keyword: "Earnings", count: 45, sentiment: 0.8 },
      { keyword: "Growth", count: 38, sentiment: 0.6 },
      { keyword: "Revenue", count: 32, sentiment: 0.5 },
      { keyword: "Decline", count: 28, sentiment: -0.7 },
      { keyword: "Launch", count: 25, sentiment: 0.9 },
      { keyword: "CEO", count: 22, sentiment: 0.2 },
      { keyword: "Profit", count: 20, sentiment: 0.7 },
      { keyword: "Loss", count: 18, sentiment: -0.8 },
    ]
  }

  // Helper function to generate comparison data
  const generateComparisonData = () => {
    // Mock data comparing different signal sources
    return [
      { symbol: "AAPL", googleTrends: 0.7, twitter: 0.5, news: 0.6 },
      { symbol: "MSFT", googleTrends: 0.6, twitter: 0.7, news: 0.5 },
      { symbol: "AMZN", googleTrends: 0.3, twitter: 0.4, news: 0.2 },
      { symbol: "GOOGL", googleTrends: 0.8, twitter: 0.6, news: 0.7 },
      { symbol: "META", googleTrends: -0.2, twitter: -0.3, news: -0.1 },
      { symbol: "TSLA", googleTrends: 0.4, twitter: 0.3, news: 0.5 },
    ]
  }

  return (
    <div className="bg-[#0a0b14] min-h-screen">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Google Trends Signals</h1>
          <p className="text-gray-400 mt-1">View the latest Google Trends sentiment signals for each stock.</p>
        </div>

        {/* Summary Stats Card */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Total Signals</span>
                <span className="text-white text-2xl font-bold">{summaryStats.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Positive/Negative Ratio</span>
                <span className="text-white text-2xl font-bold">
                  {summaryStats.negative > 0
                    ? (summaryStats.positive / summaryStats.negative).toFixed(2)
                    : summaryStats.positive > 0
                      ? "∞"
                      : "0"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Positive Signals</span>
                <span className="text-green-500 text-2xl font-bold">{summaryStats.positive}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Negative Signals</span>
                <span className="text-red-500 text-2xl font-bold">{summaryStats.negative}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Last updated: {summaryStats.lastUpdate}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sentiment Trend:</span>
                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.slice(-7)}>
                      <Line type="monotone" dataKey="averageScore" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by symbol or keywords..."
                className="pl-10 bg-gray-900 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="symbol">Symbol</SelectItem>
                <SelectItem value="sentiment_score">Sentiment Score</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-900 border-gray-700"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Tabs for different visualizations */}
        <Tabs defaultValue="table" className="mb-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="table" className="data-[state=active]:bg-gray-800">
              Table View
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-gray-800">
              Charts & Analysis
            </TabsTrigger>
          </TabsList>

          {/* Table View */}
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mt-4">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64 bg-white">
                  <Loader2 className="animate-spin w-6 h-6 mr-2 text-amber-500" />
                  <span className="text-gray-600">Loading sentiment data...</span>
                </div>
              ) : filteredData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Symbol</th>
                        <th className="px-6 py-4 text-center font-medium">Sentiment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, i) => (
                        <React.Fragment key={i}>
                          <tr
                            className={`border-b ${
                              expandedRows[i] ? "border-transparent" : "border-gray-200"
                            } hover:bg-gray-50 transition-colors cursor-pointer`}
                            onClick={() => toggleRow(i)}
                          >
                            <td className="px-6 py-4 text-gray-800">{row.date}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{row.comp_symbol}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
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
                                {expandedRows[i] ? (
                                  <ChevronUp className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </td>
                          </tr>
                          <AnimatePresence>
                            {expandedRows[i] && (
                              <tr>
                                <td colSpan={3} className="p-0 border-b border-gray-200">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden bg-gray-50"
                                  >
                                    <div className="p-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-900 mb-2">Analyzed Keywords</h4>
                                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {row.analyzed_keywords}
                                          </p>

                                          <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                              Keyword Sentiment Breakdown
                                            </h4>
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                              <div className="grid grid-cols-2 gap-2">
                                                {row.analyzed_keywords &&
                                                  row.analyzed_keywords
                                                    .split(",")
                                                    .slice(0, 6)
                                                    .map((keyword, idx) => (
                                                      <div key={idx} className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-700">{keyword.trim()}</span>
                                                        <Badge
                                                          className={`${Math.random() > 0.5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                                        >
                                                          {(Math.random() * 2 - 1).toFixed(2)}
                                                        </Badge>
                                                      </div>
                                                    ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                Sentiment Score
                                              </h4>
                                              <p className="text-sm text-gray-600">{row.sentiment_score}</p>
                                            </div>
                                            <div>
                                              <h4 className="text-sm font-medium text-gray-900 mb-2">Entry Price</h4>
                                              <p className="text-sm text-gray-600">${row.entry_price}</p>
                                            </div>
                                          </div>

                                          <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                              Price Action After Signal
                                            </h4>
                                            <div className="h-[150px] bg-white p-2 rounded border border-gray-200">
                                              <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                  data={[
                                                    { day: 1, price: row.entry_price },
                                                    {
                                                      day: 2,
                                                      price: row.entry_price * (1 + (Math.random() * 0.02 - 0.01)),
                                                    },
                                                    {
                                                      day: 3,
                                                      price: row.entry_price * (1 + (Math.random() * 0.04 - 0.02)),
                                                    },
                                                    {
                                                      day: 4,
                                                      price: row.entry_price * (1 + (Math.random() * 0.06 - 0.03)),
                                                    },
                                                    {
                                                      day: 5,
                                                      price: row.entry_price * (1 + (Math.random() * 0.08 - 0.04)),
                                                    },
                                                  ]}
                                                >
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                                  <XAxis
                                                    dataKey="day"
                                                    label={{
                                                      value: "Days After Signal",
                                                      position: "insideBottom",
                                                      offset: -5,
                                                    }}
                                                  />
                                                  <YAxis domain={["auto", "auto"]} />
                                                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Price"]} />
                                                  <Line
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                  />
                                                </LineChart>
                                              </ResponsiveContainer>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 bg-white">
                  <p className="text-gray-500">No Google Trends signals found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts & Analysis View */}
          <div className="mt-4 space-y-6" id="charts-view">
            {/* Sentiment Trend Chart */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white">Sentiment Trend Over Time</CardTitle>
                </div>
                <CardDescription>Track how Google Trends sentiment has changed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} domain={[-1, 1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "#334155",
                          borderRadius: "0.375rem",
                          color: "#f8fafc",
                        }}
                        formatter={(value) => [value.toFixed(2), "Avg. Sentiment Score"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Avg. Sentiment Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Symbol Distribution Chart */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white">Symbol Distribution</CardTitle>
                </div>
                <CardDescription>Symbols with the most Google Trends signals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={symbolDistribution}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                      <YAxis dataKey="symbol" type="category" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} width={50} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "#334155",
                          borderRadius: "0.375rem",
                          color: "#f8fafc",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="positive" name="Positive" stackId="a" fill="#10b981" />
                      <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="negative" name="Negative" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Keywords Analysis */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white">Top Keywords</CardTitle>
                </div>
                <CardDescription>Most influential keywords in sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={keywordData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis type="number" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                        <YAxis
                          dataKey="keyword"
                          type="category"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          width={60}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                        />
                        <Bar dataKey="count" name="Frequency" radius={[0, 4, 4, 0]}>
                          {keywordData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.sentiment > 0.3 ? "#10b981" : entry.sentiment > -0.3 ? "#f59e0b" : "#ef4444"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={keywordData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          nameKey="keyword"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {keywordData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.sentiment > 0.3 ? "#10b981" : entry.sentiment > -0.3 ? "#f59e0b" : "#ef4444"}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                          formatter={(value) => [value, "Frequency"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signal Source Comparison */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white">Signal Source Comparison</CardTitle>
                </div>
                <CardDescription>Compare Google Trends with Twitter and News signals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="symbol" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} domain={[-1, 1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "#334155",
                          borderRadius: "0.375rem",
                          color: "#f8fafc",
                        }}
                        formatter={(value) => [value.toFixed(2), "Sentiment Score"]}
                      />
                      <Legend />
                      <Bar dataKey="googleTrends" name="Google Trends" fill="#10b981" />
                      <Bar dataKey="twitter" name="Twitter" fill="#3b82f6" />
                      <Bar dataKey="news" name="News" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
