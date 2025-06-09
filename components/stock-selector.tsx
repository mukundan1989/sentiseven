"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import type { Stock } from "@/types"
import { useState } from "react"

interface StockSelectorProps {
  stocks: Stock[]
  onSelect: (stock: Stock) => void
}

export function StockSelector({ stocks, onSelect }: StockSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const filteredStocks = stocks.filter((stock) => stock.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Select Stock</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Select a Stock</AlertDialogTitle>
          <AlertDialogDescription>Choose a stock from the list below.</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search" className="text-right">
              Search
            </Label>
            <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[40vh] w-full rounded-md border">
          {filteredStocks.length > 0 ? (
            <div className="p-4">
              {filteredStocks.map((stock) => (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-2 hover:bg-secondary rounded-md cursor-pointer"
                  onClick={() => {
                    onSelect(stock)
                    setOpen(false)
                    toast({
                      title: "Stock Selected",
                      description: `${stock.name} selected.`,
                    })
                  }}
                >
                  <span>{stock.name}</span>
                  <span className="text-muted-foreground">{stock.symbol}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No stocks found.</div>
          )}
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
