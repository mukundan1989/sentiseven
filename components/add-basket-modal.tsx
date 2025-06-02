"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from 'lucide-react'

interface AddBasketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (basketName: string) => void
  isLoading?: boolean
}

export function AddBasketModal({ open, onOpenChange, onSave, isLoading = false }: AddBasketModalProps) {
  const [basketName, setBasketName] = useState("")

  const handleSave = () => {
    if (basketName.trim()) {
      onSave(basketName.trim())
      setBasketName("") // Reset for next time
    }
  }

  const handleCancel = () => {
    setBasketName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add to New Basket
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="basket-name">Basket Name</Label>
            <Input
              id="basket-name"
              value={basketName}
              onChange={(e) => setBasketName(e.target.value)}
              placeholder="Enter basket name (e.g., Tech Growth, Value Picks)"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && basketName.trim()) {
                  handleSave()
                }
              }}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!basketName.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create Basket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
