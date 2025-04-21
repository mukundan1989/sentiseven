"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Plus, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample stock data
const allStocks = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 182.52, change: 1.25 },
  { id: 2, symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 417.88, change: -0.52 },
  { id: 3, symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", price: 178.75, change: 2.34 },
  { id: 4, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 175.34, change: -1.23 },
  { id: 5, symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 474.99, change: 3.45 },
  { id: 6, symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 147.68, change: 0.87 },
  { id: 7, symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment", price: 602.75, change: 1.56 },
  { id: 8, symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", price: 950.02, change: 5.23 },
  { id: 9, symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", price: 198.47, change: -0.34 },
  { id: 10, symbol: "V", name: "Visa Inc.", sector: "Financial Services", price: 275.31, change: 0.45 },
  { id: 11, symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", price: 59.86, change: 0.21 },
  { id: 12, symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive", price: 162.45, change: -0.12 },
  { id: 13, symbol: "DIS", name: "Walt Disney Co.", sector: "Entertainment", price: 112.73, change: 1.02 },
  { id: 14, symbol: "KO", name: "Coca-Cola Co.", sector: "Consumer Defensive", price: 60.12, change: 0.34 },
  { id: 15, symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer Defensive", price: 172.98, change: -0.25 },
  { id: 16, symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", price: 492.46, change: 2.15 },
  { id: 17, symbol: "INTC", name: "Intel Corp.", sector: "Technology", price: 42.37, change: -1.45 },
  { id: 18, symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", price: 284.89, change: 1.78 },
  { id: 19, symbol: "AMD", name: "Advanced Micro Devices Inc.", sector: "Technology", price: 158.76, change: 3.21 },
  { id: 20, symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services", price: 62.34, change: -0.87 },
]

// Group stocks by sector
const stocksBySector = allStocks.reduce((acc, stock) => {
  if (!acc[stock.sector]) {
    acc[stock.sector] = []
  }
  acc[stock.sector].push(stock)
  return acc
}, {})

// Sort sectors alphabetically
const sectors = Object.keys(stocksBySector).sort()

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
  const [selectedStocks, setSelectedStocks] = useState(initialStocks)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState<string | null>(null)
  const [basketName, setBasketName] = useState("Tech Leaders")

  // Reset selected stocks when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStocks(initialStocks)
    }
  }, [open, initialStocks])

  // Filter stocks based on search term and sector
  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSector = !sectorFilter || stock.sector === sectorFilter

    return matchesSearch && matchesSector
  })

  // Check if a stock is selected
  const isSelected = (stockId: number) => {
    return selectedStocks.some((stock) => stock.id === stockId)
  }

  // Toggle stock selection
  const toggleStock = (stock) => {
    if (isSelected(stock.id)) {
      setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id))
    } else {
      setSelectedStocks([...selectedStocks, stock])
    }
  }

  // Function to handle saving
  const handleSave = () => {
    // Ensure all selected stocks have valid properties
    const stocksToSave = selectedStocks.map((stock) => ({
      ...stock,
      allocation: stock.allocation || Math.floor(100 / selectedStocks.length), // Default allocation if not set
      locked: stock.locked || false, // Default to unlocked if not set
    }))

    onSave(stocksToSave)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Stock Basket</DialogTitle>
          <DialogDescription>Select stocks to include in your sentiment analysis basket.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
          {/* Left side - Available stocks */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    {sectorFilter || "All Sectors"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem onSelect={() => setSectorFilter(null)} className="flex items-center gap-2">
                          {!sectorFilter && <Check className="h-4 w-4" />}
                          <span className={!sectorFilter ? "font-medium" : ""}>All Sectors</span>
                        </CommandItem>
                        {sectors.map((sector) => (
                          <CommandItem
                            key={sector}
                            onSelect={() => setSectorFilter(sector)}
                            className="flex items-center gap-2"
                          >
                            {sectorFilter === sector && <Check className="h-4 w-4" />}
                            <span className={sectorFilter === sector ? "font-medium" : ""}>{sector}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Card className="flex-1 overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Available Stocks</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Sector</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStocks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No stocks found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStocks.map((stock) => (
                        <TableRow key={stock.id} className="group">
                          <TableCell className="font-medium">{stock.symbol}</TableCell>
                          <TableCell>{stock.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{stock.sector}</TableCell>
                          <TableCell className="text-right">
                            <span className={stock.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                              ${stock.price.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={isSelected(stock.id) ? "secondary" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => toggleStock(stock)}
                            >
                              {isSelected(stock.id) ? "Remove" : "Add"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>

          {/* Right side - Selected stocks */}
          <div className="w-full md:w-[300px] flex flex-col">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1.5 block">Basket Name</label>
              <Input value={basketName} onChange={(e) => setBasketName(e.target.value)} className="w-full" />
            </div>

            <Card className="flex-1">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Selected Stocks</CardTitle>
                  <Badge variant="secondary">{selectedStocks.length}</Badge>
                </div>
              </CardHeader>
              <ScrollArea className="h-[300px]">
                {selectedStocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p>No stocks selected</p>
                    <p className="text-sm">Add stocks from the list on the left</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {selectedStocks.map((stock) => (
                      <div
                        key={stock.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted group"
                      >
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">{stock.name}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-50 group-hover:opacity-100"
                          onClick={() => toggleStock(stock)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedStocks.length === 0}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
