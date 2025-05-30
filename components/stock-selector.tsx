"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function StockSelector({
  open,
  onOpenChange,
  initialStocks = [],
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStocks: any[]
  onSave: (stocks: any[]) => void
}) {
  const [selectedStocks, setSelectedStocks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStocks, setFilteredStocks] = useState<any[]>([])

  // Sample stock database for selection
  const stockDatabase = [
    { id: 101, symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { id: 102, symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
    { id: 103, symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { id: 104, symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
    { id: 105, symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
    { id: 106, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { id: 107, symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
    { id: 108, symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services" },
    { id: 109, symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
    { id: 110, symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive" },
    { id: 111, symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
    { id: 112, symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive" },
    { id: 113, symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services" },
    { id: 114, symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare" },
    { id: 115, symbol: "HD", name: "Home Depot Inc.", sector: "Consumer Cyclical" },
    { id: 116, symbol: "BAC", name: "Bank of America Corp.", sector: "Financial Services" },
    { id: 117, symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare" },
    { id: 118, symbol: "INTC", name: "Intel Corporation", sector: "Technology" },
    { id: 119, symbol: "VZ", name: "Verizon Communications Inc.", sector: "Communication Services" },
    { id: 120, symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology" },
  ]

  // Initialize selected stocks from initialStocks
  useEffect(() => {
    if (initialStocks && initialStocks.length > 0) {
      setSelectedStocks([...initialStocks])
    } else {
      setSelectedStocks([])
    }
  }, [initialStocks, open])

  // Filter stocks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStocks([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = stockDatabase.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query),
    )
    setFilteredStocks(results)
  }, [searchQuery])

  // Check if a stock is already selected
  const isStockSelected = (stockId: number) => {
    return selectedStocks.some((stock) => stock.id === stockId)
  }

  // Toggle stock selection
  const toggleStockSelection = (stock: any) => {
    if (isStockSelected(stock.id)) {
      setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id))
    } else {
      setSelectedStocks([...selectedStocks, stock])
    }
  }

  // Add a stock from search results
  const handleAddStock = (stock: any) => {
    if (!isStockSelected(stock.id)) {
      setSelectedStocks([...selectedStocks, stock])
    }
    setSearchQuery("")
    setFilteredStocks([])
  }

  // Remove a stock from selected stocks
  const handleRemoveStock = (stockId: number) => {
    setSelectedStocks(selectedStocks.filter((stock) => stock.id !== stockId))
  }

  // Handle save and close
  const handleSave = () => {
    onSave(selectedStocks)
    onOpenChange(false)
  }

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredStocks([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Stock Basket</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search for stocks */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Search for stocks</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by symbol, name, or sector..."
                className="pl-10 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-muted-foreground/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search results */}
            {filteredStocks.length > 0 && (
              <div className="border rounded-md max-h-60 overflow-auto">
                <ul className="divide-y">
                  {filteredStocks.map((stock) => (
                    <li
                      key={stock.id}
                      className={`px-4 py-3 flex items-center justify-between hover:bg-accent cursor-pointer ${
                        isStockSelected(stock.id) ? "bg-accent/50" : ""
                      }`}
                      onClick={() => handleAddStock(stock)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol}</span>
                          <Badge variant="outline" className="font-normal">
                            {stock.sector}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <Button
                        variant={isStockSelected(stock.id) ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStockSelection(stock)
                        }}
                      >
                        {isStockSelected(stock.id) ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </>
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Selected stocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Selected stocks</h3>
              <Badge variant="outline" className="text-xs">
                {selectedStocks.length} stocks
              </Badge>
            </div>

            {selectedStocks.length > 0 ? (
              <div className="border rounded-md max-h-60 overflow-auto">
                <ul className="divide-y">
                  {selectedStocks.map((stock) => (
                    <li key={stock.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol}</span>
                          <Badge variant="outline" className="font-normal">
                            {stock.sector}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveStock(stock.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center">
                <p className="text-muted-foreground">No stocks selected. Search and add stocks above.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
          <div className="text-sm text-muted-foreground">
            {selectedStocks.length} {selectedStocks.length === 1 ? "stock" : "stocks"} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
