"use client"

import { useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"

export default function PerformancePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stocksData, setStocksData] = useState([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      lockDate: "2025-01-30",
      lockPrice: 184.37,
      lockSentiment: "positive",
      currentPrice: 189.98,
      change: 5.61,
      changePercent: 3.04,
      currentSentiment: "positive",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      lockDate: "2024-12-30",
      lockPrice: 378.04,
      lockSentiment: "positive",
      currentPrice: 401.92,
      change: 23.88,
      changePercent: 6.88,
      currentSentiment: "positive",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      lockDate: "2024-10-30",
      lockPrice: 142.45,
      lockSentiment: "positive",
      currentPrice: 165.72,
      change: 23.27,
      changePercent: 16.34,
      currentSentiment: "positive",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      lockDate: "2024-09-30",
      lockPrice: 178.08,
      lockSentiment: "negative",
      currentPrice: 182.41,
      change: 4.33,
      changePercent: 2.43,
      currentSentiment: "positive",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      lockDate: "2024-06-30",
      lockPrice: 474.99,
      lockSentiment: "positive",
      currentPrice: 481.73,
      change: 6.74,
      changePercent: 1.42,
      currentSentiment: "positive",
    },
  ])

  // Format date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Get current date for the footer
  const currentDate = new Date()
  const formattedCurrentDate = `${currentDate.toLocaleString("default", { month: "short" })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Performance Summary</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Stocks Performance Table</h2>
                <p className="text-sm text-gray-500">
                  Historical and current performance data for your stock portfolio
                </p>
              </div>
              <div className="relative">
                <button className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">
                  <span>Growth Portfolio</span>
                  <span className="ml-2 text-xs text-gray-500">5 stocks</span>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading performance data...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md m-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr>
                    <th colSpan={2} className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">
                      Stock
                    </th>
                    <th colSpan={2} className="px-6 py-3 bg-blue-100 text-gray-700 border-b border-gray-200">
                      Locked
                    </th>
                    <th className="px-6 py-3 bg-blue-100 text-gray-700 border-b border-gray-200">Sentiment</th>
                    <th colSpan={3} className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">
                      Current
                    </th>
                  </tr>
                  <tr>
                    <th className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">Symbol</th>
                    <th className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">Name</th>
                    <th className="px-6 py-3 bg-blue-100 text-gray-700 border-b border-gray-200">Date</th>
                    <th className="px-6 py-3 bg-blue-100 text-gray-700 border-b border-gray-200">Price</th>
                    <th className="px-6 py-3 bg-blue-100 text-gray-700 border-b border-gray-200">Sentiment</th>
                    <th className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">Price</th>
                    <th className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">Change</th>
                    <th className="px-6 py-3 bg-blue-50 text-gray-700 border-b border-gray-200">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {stocksData.map((stock, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{stock.symbol}</td>
                      <td className="px-6 py-4 text-gray-700">{stock.name}</td>
                      <td className="px-6 py-4 text-gray-700 bg-blue-50">{stock.lockDate}</td>
                      <td className="px-6 py-4 text-gray-700 bg-blue-50">${stock.lockPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 bg-blue-50">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md ${
                            stock.lockSentiment === "positive"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.lockSentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">${stock.currentPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 font-medium text-green-600">
                        ↑ +{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md ${
                            stock.currentSentiment === "positive"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.currentSentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-200">
                Stock data as of May 5, 2025
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
