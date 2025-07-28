"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUp,
  ArrowDown,
  Activity,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
  Zap,
  Users,
  Globe,
  Smartphone,
} from "lucide-react"
import { StockDetailView } from "./components/stock-detail-view"
import { CorrelationChart } from "./components/correlation-chart"
import { AddBasketModal } from "./components/add-basket-modal"
import { useAuth } from "@/context/auth-context"
import {
  saveBasket,
  getMostRecentBasket,
  getAllUserBaskets,
  getBasketById,
  deleteBasket,
  unlockBasket,
  type StockBasket,
  type BasketStock,
} from "@/lib/basket-service"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { PortfolioChangeChart } from "@/components/portfolio-change-chart"
import { ImpactCard } from "@/components/impact-card"

// Mock data for demonstration
const mockPortfolioData = [
  { date: "2024-01", value: 100000, sentiment: 0.65 },
  { date: "2024-02", value: 105000, sentiment: 0.72 },
  { date: "2024-03", value: 98000, sentiment: 0.45 },
  { date: "2024-04", value: 112000, sentiment: 0.78 },
  { date: "2024-05", value: 108000, sentiment: 0.68 },
  { date: "2024-06", value: 115000, sentiment: 0.82 },
]

const mockSignalData = [
  { source: "Twitter", positive: 245, negative: 89, neutral: 156, trend: "up" },
  { source: "News", positive: 189, negative: 134, neutral: 267, trend: "down" },
  { source: "Reddit", positive: 334, negative: 67, neutral: 199, trend: "up" },
  { source: "Google Trends", positive: 156, negative: 45, neutral: 89, trend: "up" },
]

const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35, sentiment: 0.78 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -1.23, changePercent: -0.85, sentiment: 0.65 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 5.67, changePercent: 1.52, sentiment: 0.82 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -8.91, changePercent: -3.46, sentiment: 0.45 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.78, change: 3.21, changePercent: 2.25, sentiment: 0.71 },
]

const SentimentDashboard = () => {
  // Auth context
  const { user } = useAuth()
  const { toast } = useToast()

  // State for time period and source weights
  const [timePeriod, setTimePeriod] = useState("1w")
  const [weights, setWeights] = useState({
    twitter: 0.4,
    googleTrends: 0.3,
    news: 0.3,
  })

  // Add this after the weights state
  const [weightLocks, setWeightLocks] = useState({
    twitter: false,
    googleTrends: false,
    news: false,
  })

  // Add this state for date editing near the other state declarations
  const [isEditingLockDate, setIsEditingLockDate] = useState(false)

  // Sample basket of stocks with allocation percentages
  const [stocks, setStocks] = useState([
    { id: 1, symbol: "AAPL", name: "Apple Inc.", sector: "Technology", allocation: 25, locked: false },
    { id: 2, symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", allocation: 20, locked: true },
    { id: 3, symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", allocation: 20, locked: false },
    { id: 4, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", allocation: 15, locked: false },
    { id: 5, symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", allocation: 20, locked: true },
  ])

  // State for basket management
  const [basketId, setBasketId] = useState<string | null>(null)
  const [basketName, setBasketName] = useState("Tech Leaders")
  const [basketLocked, setBasketLocked] = useState(false)
  const [basketDates, setBasketDates] = useState({
    created: null,
    updated: null,
    locked: null,
  })

  // State for basket management
  const [allBaskets, setAllBaskets] = useState<StockBasket[]>([])
  const [selectedBasketId, setSelectedBasketId] = useState<string | null>(null)
  const [isLoadingBaskets, setIsLoadingBaskets] = useState(false)

  // State for Add Basket Modal
  const [isAddBasketModalOpen, setIsAddBasketModalOpen] = useState(false)

  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // Sample sentiment data
  const sentimentData = {
    "1d": generateSentimentData(1),
    "1w": generateSentimentData(7),
    "1m": generateSentimentData(30),
  }

  // State for stock selector dialog
  const [isStockSelectorOpen, setIsStockSelectorOpen] = useState(false)

  // State for selected stock
  const [selectedStock, setSelectedStock] = useState<string | null>(null)

  // State for allocation editor
  const [isAllocationEditorOpen, setIsAllocationEditorOpen] = useState(false)

  // Add a new state for the unlock alert dialog
  const [isUnlockBasketAlertOpen, setIsUnlockBasketAlertOpen] = useState(false)

  // State for section collapse
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    inputs: false,
    insights: false,
    tracking: false,
  })

  // Load user's baskets and most recent basket when component mounts
  useEffect(() => {
    if (user) {
      loadUserBaskets()
      loadMostRecentBasket()
    }
  }, [user])

  // Load all user baskets
  const loadUserBaskets = async () => {
    setIsLoadingBaskets(true)
    try {
      const { baskets, error } = await getAllUserBaskets()

      if (error) {
        console.error("Error loading baskets:", error)
        return
      }

      if (baskets) {
        setAllBaskets(baskets)
      }
    } catch (error) {
      console.error("Error in loadUserBaskets:", error)
    } finally {
      setIsLoadingBaskets(false)
    }
  }

  // Load a specific basket
  const loadBasket = async (basketId: string) => {
    setIsLoading(true)
    try {
      const { basket, stocks: basketStocks, error } = await getBasketById(basketId)

      if (error) {
        console.error("Error loading basket:", error)
        toast({
          title: "Error",
          description: "Failed to load the selected basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (basket) {
        // Update the state with the loaded basket
        setBasketId(basket.id)
        setSelectedBasketId(basket.id)
        setBasketName(basket.name)
        setBasketLocked(basket.is_locked)
        setWeights(basket.source_weights)

        // Convert dates
        if (basket.created_at) {
          setBasketDates({
            created: new Date(basket.created_at),
            updated: basket.updated_at ? new Date(basket.updated_at) : null,
            locked: basket.locked_at ? new Date(basket.locked_at) : null, // Add locked date
          })
        }

        // Convert stocks format
        if (basketStocks && basketStocks.length > 0) {
          const formattedStocks = basketStocks.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            sector: stock.sector,
            allocation: stock.allocation,
            locked: stock.is_locked,
          }))
          setStocks(formattedStocks)
        } else {
          setStocks([])
        }

        toast({
          title: "Basket Loaded",
          description: `Successfully loaded "${basket.name}" basket.`,
        })
      }
    } catch (error) {
      console.error("Error in loadBasket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load the most recent basket
  const loadMostRecentBasket = async () => {
    setIsLoading(true)
    try {
      const { basket, stocks: basketStocks, error } = await getMostRecentBasket()

      if (error) {
        console.error("Error loading basket:", error)
        toast({
          title: "Error",
          description: "Failed to load your basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (basket) {
        // Update the state with the loaded basket
        setBasketId(basket.id)
        setSelectedBasketId(basket.id)
        setBasketName(basket.name)
        setBasketLocked(basket.is_locked)
        setWeights(basket.source_weights)

        // Convert dates
        if (basket.created_at) {
          setBasketDates({
            created: new Date(basket.created_at),
            updated: basket.updated_at ? new Date(basket.updated_at) : null,
            locked: basket.locked_at ? new Date(basket.locked_at) : null, // Add locked date
          })
        }

        // Convert stocks format
        if (basketStocks && basketStocks.length > 0) {
          const formattedStocks = basketStocks.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            sector: stock.sector,
            allocation: stock.allocation,
            locked: stock.is_locked,
          }))
          setStocks(formattedStocks)
        }
      }
    } catch (error) {
      console.error("Error in loadMostRecentBasket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save changes to current basket
  const saveCurrentBasket = async (isLocked = false) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your basket.",
        variant: "destructive",
      })
      return
    }

    if (!basketId) {
      toast({
        title: "No Basket Selected",
        description: "Please select a basket or create a new one.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Format the basket data
      const basketData: StockBasket = {
        id: basketId,
        name: basketName,
        source_weights: weights,
        is_locked: isLocked,
        locked_at: basketDates.locked?.toISOString(), // Preserve the existing locked date
      }

      // Format the stocks data
      const stocksData: BasketStock[] = stocks.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector || "Unknown",
        allocation: stock.allocation,
        is_locked: stock.locked,
      }))

      // Save the basket
      const { error } = await saveBasket(basketData, stocksData, false)

      if (error) {
        console.error("Error saving basket:", error)
        toast({
          title: "Error",
          description: "Failed to save your basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Your changes have been saved.",
      })

      // If locking the basket, update the state
      if (isLocked) {
        setBasketLocked(true)
        const now = new Date()
        setBasketDates({
          created: basketDates.created || now,
          updated: now,
          locked: now, // Set the locked date
        })

        // Scroll to the basket tracking section
        setTimeout(() => {
          const trackingSection = document.getElementById("tracking-section")
          if (trackingSection) {
            trackingSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)

        // Only reload baskets list when locking (status change)
        await loadUserBaskets()
      }
    } catch (error) {
      console.error("Error in saveCurrentBasket:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create new basket
  const createNewBasket = async (newBasketName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a basket.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Format the basket data
      const basketData: StockBasket = {
        name: newBasketName,
        source_weights: weights,
        is_locked: false,
      }

      // Format the stocks data
      const stocksData: BasketStock[] = stocks.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector || "Unknown",
        allocation: stock.allocation,
        is_locked: stock.locked,
      }))

      // Save the new basket
      const { error, basketId: newBasketId } = await saveBasket(basketData, stocksData, true)

      if (error) {
        console.error("Error creating basket:", error)
        toast({
          title: "Error",
          description: "Failed to create new basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update state to switch to the new basket
      if (newBasketId) {
        setBasketId(newBasketId)
        setSelectedBasketId(newBasketId)
        setBasketName(newBasketName)
        setBasketLocked(false)
        const now = new Date()
        setBasketDates({
          created: now,
          updated: now,
          locked: null, // New baskets aren't locked
        })
      }

      toast({
        title: "Success",
        description: `New basket "${newBasketName}" created successfully.`,
      })

      // Close modal and reload baskets list
      setIsAddBasketModalOpen(false)
      await loadUserBaskets()
    } catch (error) {
      console.error("Error in createNewBasket:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete basket
  const handleDeleteBasket = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete a basket.",
        variant: "destructive",
      })
      return
    }

    if (!basketId) {
      toast({
        title: "No Basket Selected",
        description: "Please select a basket to delete.",
        variant: "destructive",
      })
      return
    }

    if (basketLocked) {
      toast({
        title: "Cannot Delete Locked Basket",
        description: "Locked baskets cannot be deleted to preserve tracking data.",
        variant: "destructive",
      })
      return
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete the basket "${basketName}"? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      const { error } = await deleteBasket(basketId)

      if (error) {
        console.error("Error deleting basket:", error)
        toast({
          title: "Error",
          description: "Failed to delete the basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `Basket "${basketName}" has been deleted.`,
      })

      // Reset state
      setBasketId(null)
      setSelectedBasketId(null)
      setBasketName("New Basket")
      setBasketLocked(false)
      setBasketDates({
        created: null,
        updated: null,
        locked: null, // Reset locked date
      })

      // Reload baskets list
      await loadUserBaskets()
    } catch (error) {
      console.error("Error in handleDeleteBasket:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function to handle updating the lock date
  const handleUpdateLockDate = async (newDate: Date) => {
    if (!basketId) return

    setIsLoading(true)
    try {
      // Format the date for Supabase
      const formattedDate = newDate.toISOString()

      // Update the locked_at field in the database
      const { error } = await supabase.from("stock_baskets").update({ locked_at: formattedDate }).eq("id", basketId)

      if (error) {
        console.error("Error updating lock date:", error)
        toast({
          title: "Error",
          description: "Failed to update the lock date. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update local state
      setBasketDates({
        ...basketDates,
        locked: newDate,
      })

      toast({
        title: "Success",
        description: "Lock date updated successfully.",
      })
    } catch (error) {
      console.error("Error in handleUpdateLockDate:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Unlock basket
  const handleUnlockBasket = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to unlock a basket.",
        variant: "destructive",
      })
      return
    }

    if (!basketId) {
      toast({
        title: "No Basket Selected",
        description: "Please select a basket to unlock.",
        variant: "destructive",
      })
      return
    }

    if (!basketLocked) {
      toast({
        title: "Basket Already Unlocked",
        description: "This basket is already in editable mode.",
        variant: "default",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await unlockBasket(basketId)

      if (error) {
        console.error("Error unlocking basket:", error)
        toast({
          title: "Error",
          description: "Failed to unlock the basket. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `Basket "${basketName}" has been unlocked and is now editable.`,
      })

      // Update state
      setBasketLocked(false)

      // Reload baskets list
      await loadUserBaskets()
    } catch (error) {
      console.error("Error in handleUnlockBasket:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle basket selection change
  const handleBasketChange = (basketId: string) => {
    if (basketId && basketId !== selectedBasketId) {
      loadBasket(basketId)
    }
  }

  // Toggle section collapse
  const toggleSection = (section) => {
    setSectionsCollapsed({
      ...sectionsCollapsed,
      [section]: !sectionsCollapsed[section],
    })
  }

  // Function to handle saving stocks from the stock selector
  const handleSaveStocks = (newStocks) => {
    // If these are stocks from the StockAllocation component, just update them directly
    if (newStocks.length > 0 && newStocks[0].hasOwnProperty("allocation")) {
      // Remove duplicates by id before setting
      const uniqueStocks = newStocks.filter((stock, index, self) => index === self.findIndex((s) => s.id === stock.id))
      setStocks(uniqueStocks)
      return
    }

    // Otherwise, this is from the StockSelector - handle adding new stocks
    const existingStockIds = stocks.map((stock) => stock.id)
    const brandNewStocks = newStocks.filter((stock) => !existingStockIds.includes(stock.id))
    const continuingStocks = newStocks.filter((stock) => existingStockIds.includes(stock.id))

    // Preserve allocations and locked status for existing stocks
    const updatedContinuingStocks = continuingStocks.map((newStock) => {
      const existingStock = stocks.find((s) => s.id === newStock.id)
      return {
        ...newStock,
        allocation: existingStock?.allocation || 0,
        locked: existingStock?.locked || false,
      }
    })

    // Set new stocks to 0% allocation by default
    const updatedNewStocks = brandNewStocks.map((stock) => ({
      ...stock,
      allocation: 0,
      locked: false,
    }))

    // Combine continuing and new stocks, ensuring no duplicates
    const finalStocks = [...updatedContinuingStocks, ...updatedNewStocks]
    const uniqueFinalStocks = finalStocks.filter(
      (stock, index, self) => index === self.findIndex((s) => s.id === stock.id),
    )

    setStocks(uniqueFinalStocks)
  }

  // Generate weighted composite sentiment
  const calculateWeightedSentiment = () => {
    return sentimentData[timePeriod].map((day) => {
      const weightedSentiment =
        day.twitterSentiment * weights.twitter +
        day.googleTrendsSentiment * weights.googleTrends +
        day.newsSentiment * weights.news

      return {
        ...day,
        compositeSentiment: Number.parseFloat(weightedSentiment.toFixed(2)),
      }
    })
  }

  // Add these functions after the calculateWeightedSentiment function
  // Function to toggle lock status of a weight
  const toggleWeightLock = (source) => {
    setWeightLocks({
      ...weightLocks,
      [source]: !weightLocks[source],
    })
  }

  // Update the handleWeightChange function to respect locks
  const handleWeightChange = (source, value) => {
    const newValue = Number.parseFloat(value[0])

    // Calculate how much we need to adjust other weights to maintain sum = 1
    const otherSources = Object.keys(weights).filter((key) => key !== source && !weightLocks[key])

    // If all other sources are locked, we can't adjust
    if (otherSources.length === 0) {
      // Just update this source and normalize
      const newWeights = { ...weights, [source]: newValue }
      const sum = Object.values(newWeights).reduce((a, b) => a + b, 0)

      // Normalize to ensure sum is exactly 1
      if (Math.abs(sum - 1) > 0.001) {
        // Adjust this source to make sum = 1
        newWeights[source] = newValue + (1 - sum)
      }

      setWeights(newWeights)
      return
    }

    // Calculate the total weight that should be distributed among other sources
    const remainingWeight =
      1 -
      newValue -
      Object.keys(weights)
        .filter((key) => key !== source && weightLocks[key])
        .reduce((sum, key) => sum + weights[key], 0)

    // Calculate the current sum of other unlocked weights
    const currentOtherSum = otherSources.reduce((sum, key) => sum + weights[key], 0)

    // Create new weights object
    const newWeights = { ...weights, [source]: newValue }

    // If other weights sum to zero, distribute evenly
    if (currentOtherSum === 0) {
      const evenDistribution = remainingWeight / otherSources.length
      otherSources.forEach((key) => {
        newWeights[key] = evenDistribution
      })
    } else {
      // Otherwise, distribute proportionally
      otherSources.forEach((key) => {
        const proportion = weights[key] / currentOtherSum
        newWeights[key] = remainingWeight * proportion
        newWeights[key] = isNaN(newWeights[key]) ? 0 : newWeights[key]
      })
    }

    // Ensure all weights are non-negative and sum to 1
    Object.keys(newWeights).forEach((key) => {
      newWeights[key] = Math.max(0, newWeights[key])
    })

    // Normalize to ensure sum is exactly 1
    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0)
    if (sum > 0 && Math.abs(sum - 1) > 0.001) {
      // Find an unlocked source to adjust
      const adjustSource = otherSources.length > 0 ? otherSources[0] : source
      newWeights[adjustSource] += 1 - sum
    }

    setWeights(newWeights)
  }

  const weightedData = calculateWeightedSentiment()

  // Function to handle clicking on a stock
  const handleStockClick = (stock) => {
    if (!stock) return // Guard clause to prevent clicking on undefined stock

    // Find the full stock data with price
    const stockWithPrice = stockPerformanceData.find((s) => s.id === stock.id) || {
      ...stock,
      price: 100, // Default price if not found
      change: 0, // Default change if not found
      performance: 0,
    }

    setSelectedStock(stockWithPrice)
  }

  // Function to toggle lock status of a stock
  const handleToggleLock = (stockId) => {
    const updatedStocks = stocks.map((stock) => (stock.id === stockId ? { ...stock, locked: !stock.locked } : stock))
    setStocks(updatedStocks)
  }

  // Function to reset allocations to equal distribution
  const handleResetAllocations = () => {
    // Create a copy of stocks
    const updatedStocks = [...stocks]

    // Calculate total allocation of locked stocks
    const lockedStocks = updatedStocks.filter((stock) => stock.locked)
    const lockedAllocation = lockedStocks.reduce((sum, stock) => sum + stock.allocation, 0)

    // Calculate number of unlocked stocks
    const unlockedStocks = updatedStocks.filter((stock) => !stock.locked)
    const unlockedCount = unlockedStocks.length

    if (unlockedCount === 0) {
      // If all stocks are locked, we can't reset
      return
    }

    // Calculate equal distribution for unlocked stocks
    const remainingAllocation = 100 - lockedAllocation
    const equalAllocation = Math.floor(remainingAllocation / unlockedCount)

    // Distribute equally among unlocked stocks
    updatedStocks.forEach((stock) => {
      if (!stock.locked) {
        stock.allocation = equalAllocation
      }
    })

    // Adjust for rounding errors
    const newTotal = updatedStocks.reduce((sum, stock) => sum + stock.allocation, 0)
    if (newTotal < 100) {
      // Find the first unlocked stock to adjust
      const firstUnlockedStock = updatedStocks.find((stock) => !stock.locked)
      if (firstUnlockedStock) {
        firstUnlockedStock.allocation += 100 - newTotal
      }
    }

    setStocks(updatedStocks)
  }

  // Function to update stock allocation using slider
  const handleAllocationChange = (stockId, newAllocation) => {
    // Create a copy of stocks
    const updatedStocks = [...stocks]

    // Find the stock to update
    const stockIndex = updatedStocks.findIndex((s) => s.id === stockId)
    if (stockIndex === -1) return

    // Calculate the difference in allocation
    const oldAllocation = updatedStocks[stockIndex].allocation
    const difference = newAllocation - oldAllocation

    // Update the allocation for the selected stock
    updatedStocks[stockIndex].allocation = newAllocation

    // Find unlocked stocks to adjust (excluding the one being modified)
    const unlockedStocks = updatedStocks.filter((s) => !s.locked && s.id !== stockId)

    if (unlockedStocks.length > 0) {
      // Get the total allocation of unlocked stocks (excluding the one being modified)
      const totalUnlockedAllocation = unlockedStocks.reduce((sum, s) => sum + s.allocation, 0)

      // Adjust each unlocked stock proportionally
      updatedStocks.forEach((stock) => {
        if (!stock.locked && stock.id !== stockId) {
          // Calculate the proportion this stock represents of all unlocked stocks
          const proportion =
            totalUnlockedAllocation > 0 ? stock.allocation / totalUnlockedAllocation : 1 / unlockedStocks.length
          // Reduce this stock's allocation proportionally
          stock.allocation = Math.max(0, stock.allocation - difference * proportion)
        }
      })

      // Ensure total allocation is exactly 100%
      const totalAllocation = updatedStocks.reduce((sum, stock) => sum + stock.allocation, 0)
      if (Math.abs(totalAllocation - 100) > 0.01) {
        // Find the first unlocked stock that's not the one we're updating
        const adjustmentStock = updatedStocks.find((s) => !s.locked && s.id !== stockId)
        if (adjustmentStock) {
          adjustmentStock.allocation += 100 - totalAllocation
        }
      }
    }

    // Round all allocations to integers
    updatedStocks.forEach((stock) => {
      stock.allocation = Math.round(stock.allocation)
    })

    setStocks(updatedStocks)
  }

  // Generate stock performance data
  const stockPerformanceData = stocks.map((stock) => {
    const basePerformance = Math.random() * 10 - 5 // Random between -5% and +5%
    const compositeSentiment = weightedData[weightedData.length - 1].compositeSentiment
    const sentimentImpact = compositeSentiment > 0 ? compositeSentiment * 2 : compositeSentiment
    const performance = Number.parseFloat((basePerformance + sentimentImpact).toFixed(2))

    // Generate a random price between 50 and 500
    const price = Number.parseFloat((Math.random() * 450 + 50).toFixed(2))
    const change = performance // Use performance as the change percentage

    return {
      ...stock,
      price,
      change,
      performance,
      twitterSentiment: weightedData[weightedData.length - 1].twitterSentiment,
      googleTrendsSentiment: weightedData[weightedData.length - 1].googleTrendsSentiment,
      newsSentiment: weightedData[weightedData.length - 1].compositeSentiment,
      compositeSentiment: weightedData[weightedData.length - 1].compositeSentiment,
    }
  })

  // Color function for sentiment
  const getSentimentColor = (value) => {
    if (value > 0.3) return "text-emerald-400"
    if (value >= -0.3) return "text-amber-400"
    return "text-red-400"
  }

  // Color function for performance
  const getPerformanceColor = (value) => {
    if (value > 0) return "text-emerald-400"
    return "text-red-400"
  }

  // Get sentiment icon
  const getSentimentIcon = (value) => {
    if (value > 0.3) return <ArrowUp className="h-4 w-4 text-emerald-400" />
    if (value >= -0.3) return <Activity className="h-4 w-4 text-amber-400" />
    return <ArrowDown className="h-4 w-4 text-red-400" />
  }

  // Get overall sentiment status
  const getOverallSentiment = () => {
    const latestComposite = weightedData[weightedData.length - 1].compositeSentiment

    if (latestComposite > 0.5) return { text: "Very Positive", color: "bg-gradient-to-r from-emerald-500 to-green-400" }
    if (latestComposite > 0.2) return { text: "Positive", color: "bg-gradient-to-r from-emerald-400 to-emerald-300" }
    if (latestComposite > -0.2) return { text: "Neutral", color: "bg-gradient-to-r from-amber-400 to-yellow-400" }
    if (latestComposite > -0.5) return { text: "Negative", color: "bg-gradient-to-r from-red-400 to-red-300" }
    return { text: "Very Negative", color: "bg-gradient-to-r from-red-500 to-red-400" }
  }

  const overallSentiment = getOverallSentiment()

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A"
    return date instanceof Date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : "N/A"
  }

  const [timeRange, setTimeRange] = useState("1M")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPortfolioValue = mockPortfolioData[mockPortfolioData.length - 1]?.value || 0
  const portfolioChange =
    mockPortfolioData.length > 1
      ? mockPortfolioData[mockPortfolioData.length - 1].value - mockPortfolioData[mockPortfolioData.length - 2].value
      : 0
  const portfolioChangePercent =
    mockPortfolioData.length > 1 ? (portfolioChange / mockPortfolioData[mockPortfolioData.length - 2].value) * 100 : 0

  const averageSentiment = mockPortfolioData[mockPortfolioData.length - 1]?.sentiment || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-12">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-neuropol">
              Advanced Sentiment Analytics
            </h1>
            <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
              Make smarter trading decisions with real-time sentiment analysis across multiple data sources
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalPortfolioValue.toLocaleString()}</div>
              <p className={`text-xs flex items-center ${portfolioChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {portfolioChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {portfolioChangePercent.toFixed(2)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Sentiment</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{(averageSentiment * 100).toFixed(1)}%</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${averageSentiment * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Signals</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mockSignalData.reduce((acc, signal) => acc + signal.positive + signal.negative, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across {mockSignalData.length} sources</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">73.2%</div>
              <p className="text-xs text-green-400 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.1% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                Portfolio value and sentiment correlation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioChangeChart data={mockPortfolioData} />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground">Sentiment-Price Correlation</CardTitle>
              <CardDescription className="text-muted-foreground">
                How sentiment signals correlate with price movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CorrelationChart />
            </CardContent>
          </Card>
        </div>

        {/* Signal Sources */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Signal Sources Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time sentiment data from multiple sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockSignalData.map((signal, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{signal.source}</h3>
                    {signal.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-400">Positive:</span>
                      <span className="text-foreground">{signal.positive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-400">Negative:</span>
                      <span className="text-foreground">{signal.negative}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Neutral:</span>
                      <span className="text-foreground">{signal.neutral}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Analysis */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-foreground">Stock Analysis</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Individual stock sentiment and price data
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50"
                  />
                </div>
                <Button
                  onClick={() => setIsAddBasketModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Basket
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStocks.map((stock, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${stock.price}</p>
                      <p
                        className={`text-sm flex items-center ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Sentiment</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${stock.sentiment * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {(stock.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ImpactCard
            title="Social Media Impact"
            value="High"
            change="+15%"
            trend="up"
            description="Twitter and Reddit sentiment strongly correlating with price movements"
            icon={<Users className="h-5 w-5" />}
          />
          <ImpactCard
            title="News Sentiment"
            value="Medium"
            change="-3%"
            trend="down"
            description="Mixed signals from financial news sources"
            icon={<Globe className="h-5 w-5" />}
          />
          <ImpactCard
            title="Mobile App Mentions"
            value="Low"
            change="+8%"
            trend="up"
            description="App store reviews and mobile discussions"
            icon={<Smartphone className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Modals */}
      <AddBasketModal
        isOpen={isAddBasketModalOpen}
        onClose={() => setIsAddBasketModalOpen(false)}
        onSave={createNewBasket}
        isLoading={isLoading}
      />

      {selectedStock && (
        <StockDetailView symbol={selectedStock} onClose={() => setSelectedStock(null)} timePeriod={timePeriod} />
      )}
    </div>
  )
}

// Helper function to generate sample sentiment data
function generateSentimentData(days) {
  const data = []
  const now = new Date()
  let twitterBaseline = Math.random() * 0.4 + 0.1 // 0.1 to 0.5
  let googleBaseline = Math.random() * 0.4 - 0.2 // -0.2 to 0.2
  let newsBaseline = Math.random() * 0.6 - 0.3 // -0.3 to 0.3

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Create some variability in the sentiment
    const twitterVariation = Math.random() * 0.4 - 0.2 // -0.2 to 0.2
    const googleVariation = Math.random() * 0.3 - 0.15 // -0.15 to 0.15
    const newsVariation = Math.random() * 0.5 - 0.25 // -0.25 to 0.25

    // Create some correlation between the sentiments
    const commonFactor = Math.random() * 0.3 - 0.15 // -0.15 to 0.15

    // Calculate sentiments with bounds checking
    const twitterSentiment = clamp(twitterBaseline + twitterVariation + commonFactor, -1, 1)
    const googleTrendsSentiment = clamp(googleBaseline + googleVariation + commonFactor, -1, 1)
    const newsSentiment = clamp(newsBaseline + newsVariation + commonFactor, -1, 1)

    // Format date as MM/DD
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`

    data.push({
      date: formattedDate,
      twitterSentiment,
      googleTrendsSentiment,
      newsSentiment,
    })

    // Adjust baselines slightly for trend
    twitterBaseline += Math.random() * 0.1 - 0.05
    googleBaseline += Math.random() * 0.08 - 0.04
    newsBaseline += Math.random() * 0.12 - 0.06

    // Keep baselines in reasonable range
    twitterBaseline = clamp(twitterBaseline, -0.7, 0.7)
    googleBaseline = clamp(googleBaseline, -0.7, 0.7)
    newsBaseline = clamp(newsBaseline, -0.7, 0.7)
  }

  return data
}

// Helper function to clamp a value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default SentimentDashboard
