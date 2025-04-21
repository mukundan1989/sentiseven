"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Lock, Unlock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function StockAllocation({
  open,
  onOpenChange,
  stocks = [],
  onSave,
  onAllocationChange,
  onToggleLock,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stocks: any[]
  onSave: (stocks: any[]) => void
  onAllocationChange: (stockId: number, allocation: number) => void
  onToggleLock: (stockId: number) => void
}) {
  const [localStocks, setLocalStocks] = useState(stocks)
  const [totalAllocation, setTotalAllocation] = useState(100)

  // Reset local stocks when dialog opens
  useEffect(() => {
    if (open) {
      setLocalStocks(stocks)
      setTotalAllocation(stocks.reduce((sum, stock) => sum + stock.allocation, 0))
    }
  }, [open, stocks])

  // Handle allocation change
  const handleAllocationChange = (stockId, value) => {
    const newAllocation = value[0]

    // Get the current stock
    const currentStock = localStocks.find((stock) => stock.id === stockId)
    if (!currentStock) return

    // Calculate the difference in allocation
    const difference = newAllocation - currentStock.allocation

    // If difference is 0, no need to make any changes
    if (difference === 0) return

    // Create a copy of the stocks
    let updatedStocks = [...localStocks]

    // Update the allocation for the selected stock
    updatedStocks = updatedStocks.map((stock) =>
      stock.id === stockId ? { ...stock, allocation: newAllocation } : stock,
    )

    // Find unlocked stocks to adjust (excluding the one being modified)
    const unlockedStocks = updatedStocks.filter((s) => !s.locked && s.id !== stockId)

    if (unlockedStocks.length > 0 && difference !== 0) {
      // Get the total allocation of unlocked stocks (excluding the one being modified)
      const totalUnlockedAllocation = unlockedStocks.reduce((sum, s) => sum + s.allocation, 0)

      // Only proceed if there's allocation to distribute
      if (totalUnlockedAllocation > 0) {
        // Adjust each unlocked stock proportionally
        updatedStocks = updatedStocks.map((stock) => {
          if (!stock.locked && stock.id !== stockId) {
            // Calculate the proportion this stock represents of all unlocked stocks
            const proportion = stock.allocation / totalUnlockedAllocation
            // Reduce this stock's allocation proportionally
            return {
              ...stock,
              allocation: Math.max(0, stock.allocation - difference * proportion),
            }
          }
          return stock
        })
      } else if (difference < 0) {
        // If no unlocked stocks to distribute to, prevent increasing allocation
        updatedStocks = updatedStocks.map((stock) =>
          stock.id === stockId ? { ...stock, allocation: currentStock.allocation } : stock,
        )
        return // Exit early as we can't make this change
      }
    } else if (unlockedStocks.length === 0 && difference !== 0) {
      // If there are no unlocked stocks to adjust and we're trying to change allocation,
      // prevent the change if it would make total allocation != 100%
      updatedStocks = updatedStocks.map((stock) =>
        stock.id === stockId ? { ...stock, allocation: currentStock.allocation } : stock,
      )
      return // Exit early as we can't make this change
    }

    setLocalStocks(updatedStocks)

    // Calculate total allocation
    const newTotal = updatedStocks.reduce((sum, stock) => sum + stock.allocation, 0)
    setTotalAllocation(newTotal)
  }

  // Handle toggle lock
  const handleToggleLock = (stockId) => {
    setLocalStocks(localStocks.map((stock) => (stock.id === stockId ? { ...stock, locked: !stock.locked } : stock)))
  }

  // Handle reset to equal distribution
  const handleResetDistribution = () => {
    // Create a copy of the stocks
    let resetStocks = [...localStocks]

    // Calculate total allocation of locked stocks
    const lockedStocks = resetStocks.filter((stock) => stock.locked)
    const lockedAllocation = lockedStocks.reduce((sum, stock) => sum + stock.allocation, 0)

    // Calculate number of unlocked stocks
    const unlockedStocks = resetStocks.filter((stock) => !stock.locked)
    const unlockedCount = unlockedStocks.length

    if (unlockedCount === 0) {
      // If all stocks are locked, we can't reset
      return
    }

    // Calculate equal distribution for unlocked stocks
    const remainingAllocation = 100 - lockedAllocation
    const equalAllocation = remainingAllocation > 0 ? Math.floor(remainingAllocation / unlockedCount) : 0

    // Distribute equally among unlocked stocks
    resetStocks = resetStocks.map((stock) => {
      if (!stock.locked) {
        return {
          ...stock,
          allocation: equalAllocation,
        }
      }
      return stock
    })

    // Adjust for rounding errors
    const newTotal = resetStocks.reduce((sum, stock) => sum + stock.allocation, 0)
    if (newTotal < 100) {
      // Find the first unlocked stock to adjust
      const firstUnlockedStock = resetStocks.find((stock) => !stock.locked)
      if (firstUnlockedStock) {
        firstUnlockedStock.allocation += 100 - newTotal
      }
    }

    setLocalStocks(resetStocks)
    setTotalAllocation(100)
  }

  // Handle save
  const handleSave = () => {
    // Create a copy of the stocks
    let stocksToSave = [...localStocks]

    // Round all allocations to integers
    stocksToSave = stocksToSave.map((stock) => ({
      ...stock,
      allocation: Math.round(stock.allocation),
    }))

    // Calculate the total after rounding
    const roundedTotal = stocksToSave.reduce((sum, stock) => sum + stock.allocation, 0)

    // Adjust for rounding errors to ensure total is exactly 100%
    if (roundedTotal !== 100) {
      // Find unlocked stocks
      const unlockedStocks = stocksToSave.filter((stock) => !stock.locked)

      if (unlockedStocks.length > 0) {
        // Adjust the first unlocked stock
        const firstUnlockedStock = stocksToSave.find((stock) => !stock.locked)
        if (firstUnlockedStock) {
          firstUnlockedStock.allocation += 100 - roundedTotal
        }
      } else {
        // If all stocks are locked, we can't adjust to 100%
        // In this case, we'll show an error or warning to the user
        alert("Cannot adjust allocations to 100% because all stocks are locked.")
        return
      }
    }

    onSave(stocksToSave)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock Allocations</DialogTitle>
          <DialogDescription>
            Modify the percentage allocation for each stock in your portfolio.
            {totalAllocation !== 100 && (
              <Badge variant="destructive" className="mt-2">
                Total allocation: {totalAllocation}% (should be 100%)
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {localStocks.map((stock) => (
              <Card key={stock.id} className="p-4 border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-sm text-slate-400">{stock.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleLock(stock.id)}>
                    {stock.locked ? (
                      <Lock className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Unlock className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[stock.allocation]}
                    value={[stock.allocation]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleAllocationChange(stock.id, value)}
                    disabled={stock.locked}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{stock.allocation}%</span>
                </div>
                {stock.locked && (
                  <p className="text-xs text-amber-500 mt-1">This position is locked based on sentiment analysis</p>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <div className="flex w-full justify-between items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" type="button" onClick={handleResetDistribution} className="gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-refresh-cw"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M3 21v-5h5"></path>
                    </svg>
                    Equal Distribution
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to equal distribution among unlocked stocks</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={localStocks.length === 0}>
                Save Allocations
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
