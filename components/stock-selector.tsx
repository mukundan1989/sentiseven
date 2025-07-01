"use client"
import { useState, useEffect } from "react"
import { X, Trash2, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StockSearch } from "./stock-search"
import { useToast } from "@/hooks/use-toast"
import AddBasketModal from "./add-basket-modal"
import { createBasket, updateBasket, deleteBasket, lockBasket, unlockBasket } from "@/lib/basket-service"
import type { Basket, Stock } from "@/lib/database.types"

interface StockSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (basket: Basket) => void
  initialBasket?: Basket | null
  userId: string
}

export function StockSelector({ isOpen, onClose, onSave, initialBasket, userId }: StockSelectorProps) {
  const [basketName, setBasketName] = useState(initialBasket?.name || "")
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>(initialBasket?.stocks || [])
  const [isLocked, setIsLocked] = useState(initialBasket?.locked_at !== null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setBasketName(initialBasket?.name || "")
      setSelectedStocks(initialBasket?.stocks || [])
      setIsLocked(initialBasket?.locked_at !== null)
    }
  }, [isOpen, initialBasket])

  const handleAddStock = (stock: any) => {
    if (!selectedStocks.some((s) => s.symbol === stock.symbol)) {
      setSelectedStocks((prev) => [...prev, { symbol: stock.symbol, allocation: 0 }])
    } else {
      toast({
        title: "Stock Already Added",
        description: `${stock.symbol} is already in your basket.`,
        variant: "destructive",
      })
    }
  }

  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks((prev) => prev.filter((s) => s.symbol !== symbol))
  }

  const handleSave = async () => {
    if (!basketName.trim()) {
      toast({
        title: "Basket Name Required",
        description: "Please enter a name for your basket.",
        variant: "destructive",
      })
      return
    }

    if (selectedStocks.length === 0) {
      toast({
        title: "No Stocks Selected",
        description: "Please add at least one stock to your basket.",
        variant: "destructive",
      })
      return
    }

    try {
      let updatedBasket: Basket
      if (initialBasket) {
        // Update existing basket
        updatedBasket = await updateBasket(initialBasket.id, basketName, selectedStocks)
        toast({
          title: "Basket Updated",
          description: `Basket "${basketName}" has been updated.`,
        })
      } else {
        // Create new basket
        updatedBasket = await createBasket(userId, basketName, selectedStocks)
        toast({
          title: "Basket Created",
          description: `Basket "${basketName}" has been created.`,
        })
      }
      onSave(updatedBasket)
      onClose()
    } catch (error) {
      console.error("Error saving basket:", error)
      toast({
        title: "Error Saving Basket",
        description: "There was an error saving your basket. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBasket = async () => {
    if (initialBasket) {
      try {
        await deleteBasket(initialBasket.id)
        toast({
          title: "Basket Deleted",
          description: `Basket "${initialBasket.name}" has been deleted.`,
        })
        onSave({ ...initialBasket, stocks: [] }) // Notify parent of deletion
        onClose()
      } catch (error) {
        console.error("Error deleting basket:", error)
        toast({
          title: "Error Deleting Basket",
          description: "There was an error deleting your basket. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleLock = async () => {
    if (!initialBasket) return

    try {
      if (isLocked) {
        await unlockBasket(initialBasket.id)
        setIsLocked(false)
        toast({
          title: "Basket Unlocked",
          description: `Basket "${initialBasket.name}" has been unlocked.`,
        })
      } else {
        await lockBasket(initialBasket.id)
        setIsLocked(true)
        toast({
          title: "Basket Locked",
          description: `Basket "${initialBasket.name}" has been locked.`,
        })
      }
      onSave({ ...initialBasket, locked_at: isLocked ? null : new Date().toISOString() }) // Update parent state
    } catch (error) {
      console.error("Error toggling basket lock:", error)
      toast({
        title: "Error Toggling Lock",
        description: "There was an error toggling the basket lock. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>{initialBasket ? "Edit Stock Basket" : "Create New Basket"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="basketName" className="text-right text-muted-foreground">
              Basket Name
            </label>
            <Input
              id="basketName"
              value={basketName}
              onChange={(e) => setBasketName(e.target.value)}
              className="col-span-3" // Rely on default shadcn styling for input
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-muted-foreground pt-2">Search Stocks</label>
            <div className="col-span-3">
              <StockSearch onAddStock={handleAddStock} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-muted-foreground pt-2">Selected Stocks</label>
            <ScrollArea className="col-span-3 h-[150px] rounded-md border border-border p-4 bg-muted/20">
              {selectedStocks.length === 0 ? (
                <p className="text-muted-foreground">No stocks selected yet.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedStocks.map((stock) => (
                    <li key={stock.symbol} className="flex items-center justify-between text-foreground">
                      <span>{stock.symbol}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStock(stock.symbol)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex gap-2 mb-2 sm:mb-0">
            {initialBasket && (
              <>
                <AddBasketModal
                  onConfirm={handleDeleteBasket}
                  title="Delete Basket?"
                  description={`Are you sure you want to delete "${initialBasket.name}"? This action cannot be undone.`}
                  confirmText="Delete"
                  cancelText="Cancel"
                >
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Basket
                  </Button>
                </AddBasketModal>
                <Button
                  variant="outline"
                  onClick={handleToggleLock}
                  className="w-full sm:w-auto bg-transparent" // Rely on default shadcn styling
                >
                  {isLocked ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" /> Unlock Basket
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" /> Lock Basket
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
              {" "}
              {/* Rely on default shadcn styling */}
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {" "}
              {/* Rely on default shadcn styling */}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
