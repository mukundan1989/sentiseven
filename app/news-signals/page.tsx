"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface NewsSignal {
  date: string
  comp_symbol: string
  analyzed_articles: string
  sentiment_score: number
  sentiment: string
  entry_price: number
}

export default function NewsSignalsPage() {
  const [data, setData] = useState<NewsSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/news-signals")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Error loading News signals")
        setLoading(false)
      })
  }, [])

  const getSentimentClass = (sentiment: string) => {
    if (sentiment.toLowerCase() === "positive") return "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
    if (sentiment.toLowerCase() === "negative") return "bg-red-500/20 text-red-500 border border-red-500/30"
    return "bg-amber-500/20 text-amber-500 border border-amber-500/30"
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/news-icon.png"
            alt="News Logo"
            width={60}
            height={60}
            className="bg-black p-2 rounded-md"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">News Signals</h1>
            <p className="text-slate-400 mt-1">View the latest News sentiment signals for each stock.</p>
          </div>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 shadow-lg overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-700">
            <CardTitle>Sentiment Analysis Results</CardTitle>
            <CardDescription>Latest sentiment data from News articles analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-6 h-6 mr-2 text-amber-500" />
                <span className="text-slate-300">Loading sentiment data...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Symbol</th>
                      <th className="px-4 py-3 text-left font-medium">Articles</th>
                      <th className="px-4 py-3 text-right font-medium">Score</th>
                      <th className="px-4 py-3 text-center font-medium">Sentiment</th>
                      <th className="px-4 py-3 text-right font-medium">Entry Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: NewsSignal, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                        <td className="px-4 py-3">{row.date}</td>
                        <td className="px-4 py-3 font-medium">{row.comp_symbol}</td>
                        <td className="px-4 py-3 max-w-xs">{row.analyzed_articles}</td>
                        <td className="px-4 py-3 text-right">{row.sentiment_score}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getSentimentClass(row.sentiment)}`}
                          >
                            {row.sentiment}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">${row.entry_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-slate-400">No News signals found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
