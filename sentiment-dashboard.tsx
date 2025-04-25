"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const SentimentDashboard = () => {
  const [basketName, setBasketName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder for the actual save basket function
  const saveCurrentBasket = async (lock: boolean) => {
    setIsLoading(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Saving basket with name: ${basketName}, Lock: ${lock}`)
    setIsLoading(false)
  }

  const handleLockBasket = async () => {
    await saveCurrentBasket(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sentiment Dashboard</h1>

      {/* Lock in Basket Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
        <div className="w-full md:w-64">
          <label htmlFor="basket-name" className="text-sm font-medium text-slate-400 mb-2 block">
            Basket Name
          </label>
          <Input
            id="basket-name"
            value={basketName}
            onChange={(e) => setBasketName(e.target.value)}
            className="bg-slate-800 border-slate-700"
            placeholder="Enter basket name"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            size="lg"
            className="bg-slate-700 hover:bg-slate-600 px-8 py-6 text-lg w-full md:w-auto mt-4 md:mt-6"
            onClick={() => saveCurrentBasket(false)}
            disabled={!basketName.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-6 text-lg w-full md:w-auto mt-4 md:mt-6"
            onClick={handleLockBasket}
            disabled={!basketName.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Lock in Basket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SentimentDashboard
