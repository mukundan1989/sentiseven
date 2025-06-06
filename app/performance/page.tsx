"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { getCurrentPrice } from "@/lib/price-utils"

export default function PerformancePage() {
  const [lockedBaskets, setLockedBaskets] = useState([])
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState({})
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchLockedBaskets()
    }
  }, [user])

  const fetchLockedBaskets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("stock_baskets")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_locked", true)
        .order("created_at", { ascending: false })

      if (error) throw error

      setLockedBaskets(data || [])

      // Calculate performance for each locked basket
      const performancePromises = data.map(calculateBasketPerformance)
      const performanceResults = await Promise.all(performancePromises)

      const performanceMap = {}
      performanceResults.forEach((result, index) => {
        performanceMap[data[index].id] = result
      })

      setPerformanceData(performanceMap)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching locked baskets:", error)
      setLoading(false)
    }
  }

  const calculateBasketPerformance = async (basket) => {
    try {
      const stocks = basket.stocks || {}
      const lockPrices = basket.lock_prices || {}
      const stockSymbols = Object.keys(stocks)

      // Calculate performance for each stock
      const stockPerformances = await Promise.all(
        stockSymbols.map(async (symbol) => {
          try {
            // Get lock price from stored data
            const lockPrice = lockPrices[symbol] || 100 // Fallback

            // Get current price
            const currentPrice = await getCurrentPrice(symbol)

            // Calculate performance
            const performance = ((currentPrice - lockPrice) / lockPrice) * 100

            return {
              symbol,
              lockPrice,
              currentPrice,
              performance: Number.parseFloat(performance.toFixed(2)),
              weight: stocks[symbol],
            }
          } catch (error) {
            console.error(`Error calculating performance for ${symbol}:`, error)
            return {
              symbol,
              lockPrice: 0,
              currentPrice: 0,
              performance: 0,
              weight: stocks[symbol],
            }
          }
        }),
      )

      // Calculate weighted average performance
      let totalWeight = 0
      let weightedPerformance = 0

      stockPerformances.forEach(({ performance, weight }) => {
        totalWeight += weight
        weightedPerformance += performance * weight
      })

      const averagePerformance = totalWeight > 0 ? weightedPerformance / totalWeight : 0

      return {
        stocks: stockPerformances,
        averagePerformance: Number.parseFloat(averagePerformance.toFixed(2)),
      }
    } catch (error) {
      console.error("Error calculating basket performance:", error)
      return { stocks: [], averagePerformance: 0 }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Performance Tracking</h1>

      {loading ? (
        <div className="text-center py-10">Loading performance data...</div>
      ) : lockedBaskets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No locked baskets found.</p>
          <p className="text-gray-500 mt-2">Lock a basket to start tracking its performance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lockedBaskets.map((basket) => {
            const performance = performanceData[basket.id] || { stocks: [], averagePerformance: 0 }

            return (
              <Card key={basket.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{basket.name}</span>
                    <span
                      className={`text-lg ${
                        performance.averagePerformance > 0
                          ? "text-green-600"
                          : performance.averagePerformance < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {performance.averagePerformance > 0 ? "+" : ""}
                      {performance.averagePerformance}%
                    </span>
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    <div>Created: {formatDate(basket.created_at)}</div>
                    <div>Locked On: {formatDate(basket.locked_at)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Stock</th>
                        <th className="text-right py-2">Lock Price</th>
                        <th className="text-right py-2">Current</th>
                        <th className="text-right py-2">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.stocks.map((stock) => (
                        <tr key={stock.symbol} className="border-b">
                          <td className="py-2">{stock.symbol}</td>
                          <td className="text-right py-2">${stock.lockPrice.toFixed(2)}</td>
                          <td className="text-right py-2">${stock.currentPrice.toFixed(2)}</td>
                          <td
                            className={`text-right py-2 ${
                              stock.performance > 0
                                ? "text-green-600"
                                : stock.performance < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {stock.performance > 0 ? "+" : ""}
                            {stock.performance}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
