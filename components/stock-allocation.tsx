"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface Stock {
  id: string
  name: string
  allocation: number
  locked: boolean
}

interface StockAllocationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stocks: Stock[]
  onSave: (stocks: Stock[]) => void
}

const StockAllocation: React.FC<StockAllocationProps> = ({ open, onOpenChange, stocks, onSave }) => {
  const [localStocks, setLocalStocks] = useState<Stock[]>([...stocks])
  const [totalAllocation, setTotalAllocation] = useState<number>(0)

  useEffect(() => {
    setLocalStocks([...stocks])
  }, [stocks])

  useEffect(() => {
    setTotalAllocation(localStocks.reduce((sum, stock) => sum + stock.allocation, 0))
  }, [localStocks])

  const handleAllocationChange = (id: string, allocation: number) => {
    setLocalStocks((prevStocks) =>
      prevStocks.map((stock) => (stock.id === id ? { ...stock, allocation: allocation } : stock)),
    )
  }

  const handleLockChange = (id: string) => {
    setLocalStocks((prevStocks) =>
      prevStocks.map((stock) => (stock.id === id ? { ...stock, locked: !stock.locked } : stock)),
    )
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

    console.log("Saving stocks with allocations:", stocksToSave)
    onSave(stocksToSave)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stock Allocation</AlertDialogTitle>
          <AlertDialogDescription>
            Allocate percentages to each stock. Total allocation must be 100%. Current total: {totalAllocation}%
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {localStocks.map((stock) => (
            <div key={stock.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={stock.id}>{stock.name}</Label>
              <Input
                type="number"
                id={stock.id}
                value={stock.allocation}
                onChange={(e) => {
                  const newAllocation = Number.parseFloat(e.target.value)
                  if (!isNaN(newAllocation)) {
                    handleAllocationChange(stock.id, newAllocation)
                  }
                }}
                className="col-span-1"
              />
              <Slider
                defaultValue={[stock.allocation]}
                max={100}
                step={1}
                onValueChange={(value) => {
                  handleAllocationChange(stock.id, value[0])
                }}
                className="col-span-1"
              />
              <Switch
                id={`lock-${stock.id}`}
                checked={stock.locked}
                onCheckedChange={() => handleLockChange(stock.id)}
              />
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={totalAllocation !== 100}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StockAllocation
