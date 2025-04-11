"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, DollarSign, TrendingUp, BarChart } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Image from "next/image"

// Function to generate mock stock price data
const generateStockPriceData = () => {
  const data = []
  const startDate = new Date("2024-01-01")
  let price = 175

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Add some random fluctuation to the price
    price = price + i * 0.5 + (Math.random() * 2 - 1)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(price.toFixed(2)),
    })
  }

  return data
}

// Function to create a custom gauge chart component
const GaugeChart = ({ value, size = 200 }) => {
  const radius = size / 2
  const innerRadius = radius * 0.6
  const startAngle = 180
  const endAngle = 0

  // Calculate the angle for the needle based on the value (0-100)
  const needleAngle = startAngle - (value / 100) * (startAngle - endAngle)
  const needleLength = radius * 0.8

  // Calculate the needle endpoint using trigonometry
  const needleX = radius + needleLength * Math.cos((needleAngle * Math.PI) / 180)
  const needleY = radius + needleLength * Math.sin((needleAngle * Math.PI) / 180)

  // Create gauge segments data
  const gaugeData = [
    { name: "Low", value: 50, color: "#cddc39" },
    { name: "Medium", value: 25, color: "#8bc34a" },
    { name: "High", value: 25, color: "#006400" },
  ]

  return (
    <div className="relative" style={{ width: size, height: size, margin: "0 auto" }}>
      <PieChart width={size} height={size}>
        <Pie
          data={gaugeData}
          cx={radius}
          cy={radius}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={radius}
          paddingAngle={0}
          dataKey="value"
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      {/* Needle */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg width={size} height={size}>
          <line x1={radius} y1={radius} x2={needleX} y2={needleY} stroke="#ffffff" strokeWidth={2} />
          <circle cx={radius} cy={radius} r={5} fill="#ffffff" />
        </svg>
      </div>

      {/* Value text */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="text-xl font-bold text-white">{value}%</span>
      </div>
    </div>
  )
}

export default function StockSignalPage() {
  const [stockPriceData, setStockPriceData] = useState([])

  useEffect(() => {
    // Generate mock data when component mounts
    setStockPriceData(generateStockPriceData())
  }, [])

  // Twitter sentiment data for donut chart
  const twitterSentimentData = [
    { name: "Positive", value: 45, color: "#00ff00" },
    { name: "Negative", value: 30, color: "#ff0000" },
    { name: "Neutral", value: 25, color: "#808080" },
  ]

  return (
    <div className="bg-[#0a0b14] min-h-screen">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Image
            src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/stocksignal-icon.png"
            alt="Stock Signal Logo"
            width={70}
            height={70}
            className="rounded-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-white text-center">Stock Signal Page</h1>
            <p className="text-gray-400 mt-1 text-center">Insights and Analysis from various models.</p>
          </div>
        </div>

        {/* Company Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="rounded-full bg-gray-800 p-3 mr-4">
                  <BarChart className="h-6 w-6 text-white opacity-70" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">AAPL</h2>
                  <p className="text-gray-400">Apple Inc.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="rounded-full bg-gray-800 p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-white opacity-70" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">$175.34</h2>
                  <p className="text-gray-400">Current Price</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="rounded-full bg-gray-800 p-3 mr-4">
                  <TrendingUp className="h-6 w-6 text-white opacity-70" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">70%</h2>
                  <p className="text-gray-400">Sentiment Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Price Trend Chart */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Stock Price Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockPriceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                  <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      borderColor: "#333",
                      borderRadius: "0.375rem",
                      color: "#fff",
                    }}
                    formatter={(value) => [`$${value}`, "Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#00ff9f"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Twitter Sentiment Block */}
        <h2 className="text-2xl font-bold text-white mb-4">Twitter Sentiment</h2>
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Keywords Analyzed */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-white mb-2">Keywords Analyzed</h3>
                <p className="text-3xl font-bold text-white">145</p>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center">
                <div className="w-[200px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={twitterSentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {twitterSentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          borderColor: "#333",
                          borderRadius: "0.375rem",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center">
                <ArrowUp className="h-24 w-24 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Sentiment Block */}
        <h2 className="text-2xl font-bold text-white mb-4">News Sentiment</h2>
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Positive Sentiment */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-white mb-2">Positive Sentiment</h3>
                <p className="text-3xl font-bold text-white">70%</p>
              </div>

              {/* Speedometer */}
              <div className="flex justify-center">
                <GaugeChart value={70} />
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center">
                <ArrowUp className="h-24 w-24 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
