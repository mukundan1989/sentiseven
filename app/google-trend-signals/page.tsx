"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function GoogleTrendSignalsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState({})

  useEffect(() => {
    fetch("/api/gtrend-signals")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setLoading(false)
      })
  }, [])

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="bg-[#0a0b14] min-h-screen">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Google Trends Signals</h1>
          <p className="text-gray-400 mt-1">View the latest Google Trends sentiment signals for each stock.</p>
        </div>

        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0">
          <CardHeader className="bg-white pb-2 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-black text-xl">Sentiment Analysis Results</CardTitle>
                <CardDescription className="text-gray-500">Click on a row to view detailed information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white">
                <Loader2 className="animate-spin w-6 h-6 mr-2 text-amber-500" />
                <span className="text-gray-600">Loading sentiment data...</span>
              </div>
            ) : data.length > 0 ? (
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
                    {data.map((row, i) => (
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
                                  <div className="p-6 space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900 mb-2">Analyzed Keywords</h4>
                                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                        {row.analyzed_keywords}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Sentiment Score</h4>
                                        <p className="text-sm text-gray-600">{row.sentiment_score}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Entry Price</h4>
                                        <p className="text-sm text-gray-600">${row.entry_price}</p>
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
                <p className="text-gray-500">No Google Trends signals found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
