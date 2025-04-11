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
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/gtrend-logo.png"
            alt="Google Trends Logo"
            className="w-14 h-14 bg-black p-1 rounded"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Google Trends Signals</h1>
            <p className="text-slate-400 mt-1">View the latest Google Trends sentiment signals for each stock.</p>
          </div>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 shadow-lg overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-700">
            <CardTitle>Sentiment Analysis Results</CardTitle>
            <CardDescription>Click on a row to view detailed information</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-6 h-6 mr-2 text-amber-500" />
                <span className="text-slate-300">Loading sentiment data...</span>
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Symbol</th>
                      <th className="px-4 py-3 text-center font-medium">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <React.Fragment key={i}>
                        <tr
                          className={`border-b ${expandedRows[i] ? "border-transparent" : "border-slate-700"} hover:bg-slate-700/50 transition-colors cursor-pointer`}
                          onClick={() => toggleRow(i)}
                        >
                          <td className="px-4 py-3">{row.date}</td>
                          <td className="px-4 py-3 font-medium">{row.comp_symbol}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                                  ${
                                    row.sentiment.toLowerCase() === "positive"
                                      ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                      : row.sentiment.toLowerCase() === "negative"
                                        ? "bg-red-500/20 text-red-500 border border-red-500/30"
                                        : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                                  }`}
                              >
                                {row.sentiment}
                              </span>
                              {expandedRows[i] ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {expandedRows[i] && (
                            <tr>
                              <td colSpan={3} className="p-0 border-b border-slate-700">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-slate-800/50"
                                >
                                  <div className="p-4 space-y-3">
                                    <div>
                                      <h4 className="text-sm font-medium text-slate-300 mb-1">Analyzed Keywords</h4>
                                      <p className="text-sm text-slate-400 whitespace-pre-wrap">
                                        {row.analyzed_keywords}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-slate-300 mb-1">Sentiment Score</h4>
                                        <p className="text-sm text-slate-400">{row.sentiment_score}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-slate-300 mb-1">Entry Price</h4>
                                        <p className="text-sm text-slate-400">${row.entry_price}</p>
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
              <div className="flex justify-center items-center h-64">
                <p className="text-slate-400">No Google Trends signals found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
