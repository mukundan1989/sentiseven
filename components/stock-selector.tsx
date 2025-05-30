"use client"

import type React from "react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Stock } from "@/types"
import { useEffect, useState } from "react"

interface StockSelectorProps {
  open: boolean
  setOpen: (open: boolean) => void
  availableStocks: Stock[]
  selectedStocks: Stock[]
  setSelectedStocks: (stocks: Stock[]) => void
  onSave: () => void
}

const StockSelector = ({
  open,
  setOpen,
  availableStocks,
  selectedStocks,
  setSelectedStocks,
  onSave,
}: StockSelectorProps) => {
  const [search, setSearch] = useState("")
  const [available, setAvailable] = useState(availableStocks)

  useEffect(() => {
    setAvailable(availableStocks)
  }, [availableStocks])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (e.target.value === "") {
      setAvailable(availableStocks)
      return
    }
    const filteredStocks = availableStocks.filter((stock) =>
      stock.name.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setAvailable(filteredStocks)
  }

  const handleAddStock = (stock: Stock) => {
    if (selectedStocks.find((s) => s.id === stock.id)) return
    setSelectedStocks([...selectedStocks, stock])
    setAvailable(available.filter((s) => s.id !== stock.id))
  }

  const handleRemoveStock = (stock: Stock) => {
    if (availableStocks.find((s) => s.id === stock.id)) {
      setAvailable(availableStocks)
    } else {
      setAvailable([...available, stock])
    }
    setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id))
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select Stocks</AlertDialogTitle>
          <AlertDialogDescription>Add stocks to your basket to track their performance.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search" className="text-right">
              Search
            </Label>
            <Input
              type="search"
              id="search"
              placeholder="Search stocks..."
              value={search}
              onChange={handleSearch}
              className="pl-10 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 items-center gap-4">
            <div>
              <Label htmlFor="available">Available Stocks</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {available.map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between py-2">
                    <span>{stock.name}</span>
                    <button
                      className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                      onClick={() => handleAddStock(stock)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div>
              <Label htmlFor="selected">Selected Stocks</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {selectedStocks.map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between py-2">
                    <span>{stock.name}</span>
                    <button
                      className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/80"
                      onClick={() => handleRemoveStock(stock)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StockSelector
