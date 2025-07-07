"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StockDetailView } from "./stock-detail-view"

// Sample stock data for search results
const stockDatabase = [
  {
    id: 101,
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 217.56,
    change: -2.51,
    twitterSentiment: 0.2,
    googleTrendsSentiment: 0.1,
    newsSentiment: -0.1,
    compositeSentiment: 0.04,
  },
  {
    id: 102,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    price: 425.22,
    change: 1.2,
    twitterSentiment: 0.5,
    googleTrendsSentiment: 0.3,
    newsSentiment: 0.4,
    compositeSentiment: 0.4,
  },
  {
    id: 103,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 175.98,
    change: 0.8,
    twitterSentiment: 0.3,
    googleTrendsSentiment: 0.6,
    newsSentiment: 0.2,
    compositeSentiment: 0.37,
  },
  {
    id: 104,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Cyclical",
    price: 185.07,
    change: -0.5,
    twitterSentiment: 0.1,
    googleTrendsSentiment: 0.2,
    newsSentiment: -0.3,
    compositeSentiment: 0,
  },
  {
    id: 105,
    symbol: "META",
    name: "Meta Platforms Inc.",
    sector: "Technology",
    price: 511.32,
    change: 2.1,
    twitterSentiment: 0.4,
    googleTrendsSentiment: 0.1,
    newsSentiment: 0.2,
    compositeSentiment: 0.23,
  },
  {
    id: 106,
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    price: 175.34,
    change: -1.8,
    twitterSentiment: -0.2,
    googleTrendsSentiment: 0.3,
    newsSentiment: -0.4,
    compositeSentiment: -0.1,
  },
  {
    id: 107,
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    price: 950.02,
    change: 3.2,
    twitterSentiment: 0.8,
    googleTrendsSentiment: 0.7,
    newsSentiment: 0.6,
    compositeSentiment: 0.7,
  },
  {
    id: 108,
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    price: 198.47,
    change: 0.3,
    twitterSentiment: 0.1,
    googleTrendsSentiment: -0.1,
    newsSentiment: 0.2,
    compositeSentiment: 0.07,
  },
  {
    id: 109,
    symbol: "V",
    name: "Visa Inc.",
    sector: "Financial Services",
    price: 275.64,
    change: 0.5,
    twitterSentiment: 0.2,
    googleTrendsSentiment: 0.3,
    newsSentiment: 0.1,
    compositeSentiment: 0.2,
  },
  {
    id: 110,
    symbol: "WMT",
    name: "Walmart Inc.",
    sector: "Consumer Defensive",
    price: 68.92,
    change: 1.1,
    twitterSentiment: 0.3,
    googleTrendsSentiment: 0.2,
    newsSentiment: 0.4,
    compositeSentiment: 0.3,
  },
]

export function StockSearch({ onAddStock }: { onAddStock: (stock: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedStock, setSelectedStock] = useState<any | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const performSearch = (query: string) => {
    if (!query.trim()) {
      // If query is empty, show initial set of stocks (e.g., first 10)
      setSearchResults(stockDatabase.slice(0, 10))
      return
    }

    const lowerCaseQuery = query.toLowerCase()
    const results = stockDatabase.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerCaseQuery) || stock.name.toLowerCase().includes(lowerCaseQuery),
    )
    setSearchResults(results)
  }

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (searchQuery.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery)
      }, 300) // Debounce for 300ms
    } else {
      // Immediately show initial stocks if query is empty
      performSearch("")
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleClearSearch = () => {
    setSearchQuery("")
    // performSearch("") will be called by useEffect to show initial stocks
  }

  const handleStockPreview = (stock: any) => {
    setSelectedStock(stock)
    setPreviewOpen(true)
  }

  const handleAddStock = () => {
    if (selectedStock) {
      onAddStock(selectedStock)
      setPreviewOpen(false)
      setSelectedStock(null)
      setSearchQuery("")
      setSearchResults([])
    }
  }

  return (
    <div className="w-full">
      {" "}
      {/* Removed 'relative' from here, as the dropdown is now in flow */}
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for stocks by symbol or name..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
      {/* Search Results Container - now in normal flow */}
      <div className="mt-2 w-full bg-popover border border-border rounded-md shadow-lg overflow-hidden">
        <ul className="py-1 max-h-60 min-h-[150px] overflow-y-auto">
          {" "}
          {/* Added min-h-[150px] and ensured overflow-y-auto */}
          {searchResults.length > 0 ? (
            searchResults.map((stock) => (
              <li
                key={stock.id}
                className="px-4 py-2 hover:bg-accent cursor-pointer text-foreground"
                onClick={() => handleStockPreview(stock)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="ml-2 text-muted-foreground">{stock.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">${stock.price.toFixed(2)}</span>
                    <span className={`ml-2 ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change}%
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-muted-foreground text-center">No matching stocks found.</li>
          )}
        </ul>
      </div>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl bg-card border-border text-foreground p-0">
          <div className="p-6">
            <StockDetailView
              stock={selectedStock}
              onBack={() => setPreviewOpen(false)}
              timePeriod="1w"
              previewMode={true}
              onAddStock={handleAddStock}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
