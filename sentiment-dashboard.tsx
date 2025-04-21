"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  Edit2,
  Lock,
  Unlock,
  RotateCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { StockSelector } from "./components/stock-selector"
import { StockDetailView } from "./components/stock-detail-view"
import { CorrelationChart } from "./components/correlation-chart"
import { StockAllocation } from "./components/stock-allocation"

const SentimentDashboard = () => {
  // State for time period and source weights
  const [timePeriod, setTimePeriod] = useState("1w")
  const [weights, setWeights] = useState({
    twitter: 0.4,
    googleTrends: 0.3,
    news: 0.3,
  })

  // Sample basket of stocks with allocation percentages
  const [stocks, setStocks] = useState([
    { id: 1, symbol: "AAPL", name: "Apple Inc.", sector: "Technology", allocation: 25, locked: false },
    { id: 2, symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", allocation: 20, locked: true },
    { id: 3, symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", allocation: 20, locked: false },
    { id: 4, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", allocation: 15, locked: false },
    { id: 5, symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", allocation: 20, locked: true },
  ])

  // State for basket name
  const [basketName, setBasketName] = useState("Tech Leaders")

  // State to track if basket is locked in
  const [basketLocked, setBasketLocked] = useState(false)

  // State to track creation and update dates
  const [basketDates, setBasketDates] = useState({
    created: null,
    updated: null,
  })

  // Sample sentiment data
  const sentimentData = {
    "1d": generateSentimentData(1),
    "1w": generateSentimentData(7),
    "1m": generateSentimentData(30),
  }

  // Sample correlation data
  const correlationData = {
    twitter: 0.68,
    googleTrends: 0.42,
    news: 0.53,
  }

  // State for stock selector dialog
  const [isStockSelectorOpen, setIsStockSelectorOpen] = useState(false)

  // State for selected stock
  const [selectedStock, setSelectedStock] = useState(null)

  // State for allocation editor
  const [isAllocationEditorOpen, setIsAllocationEditorOpen] = useState(false)

  // State for premium features card index
  const [premiumFeatureIndex, setPremiumFeatureIndex] = useState(0)

  // State for premium features
  const premiumFeatures = [
    {
      title: "User Benchmarking",
      description: "Compare your sentiment-based returns against other users",
      value: "+3.2%",
      comparison: "outperforming 78% of users",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Sentiment-Price Correlation",
      description: "Detailed analysis of sentiment impact on price movements",
      value: "0.72",
      comparison: "Strong positive correlation",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "Predictive Signals",
      description: "Early indicators of sentiment shifts before price movement",
      value: "4",
      comparison: "active signals available",
      icon: <ArrowUp className="h-5 w-5" />,
    },
  ]

  // State for section collapse
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    inputs: false,
    insights: false,
    tracking: false,
  })

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
      setStocks(newStocks)

      // If basket was already locked, update the updated date
      if (basketLocked) {
        setBasketDates({
          ...basketDates,
          updated: new Date(),
        })
      }
      return
    }

    // Otherwise, this is from the StockSelector - handle adding new stocks
    // First, identify which stocks are new and which already exist
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

    // Calculate total allocation of continuing stocks
    const continuingAllocation = updatedContinuingStocks.reduce((sum, stock) => sum + (stock.allocation || 0), 0)

    // Set new stocks to 0% allocation by default
    const updatedNewStocks = brandNewStocks.map((stock) => ({
      ...stock,
      allocation: 0,
      locked: false,
    }))

    // Combine continuing and new stocks
    let finalStocks = [...updatedContinuingStocks, ...updatedNewStocks]

    // If continuing allocation is less than 100% (due to rounding or other issues),
    // distribute the remaining to unlocked continuing stocks
    if (continuingAllocation < 100 && updatedContinuingStocks.length > 0) {
      const unlockedContinuingStocks = updatedContinuingStocks.filter((stock) => !stock.locked)

      if (unlockedContinuingStocks.length > 0) {
        const remainingAllocation = 100 - continuingAllocation
        const perStockAdjustment = remainingAllocation / unlockedContinuingStocks.length

        finalStocks = finalStocks.map((stock) => {
          if (!stock.locked && existingStockIds.includes(stock.id)) {
            return {
              ...stock,
              allocation: stock.allocation + perStockAdjustment,
            }
          }
          return stock
        })
      }
    }

    // Ensure all allocations are valid numbers and rounded
    finalStocks = finalStocks.map((stock) => ({
      ...stock,
      allocation: Math.round(stock.allocation || 0),
    }))

    // Final check to ensure exactly 100% for existing stocks
    const totalAllocation = finalStocks
      .filter((s) => existingStockIds.includes(s.id))
      .reduce((sum, stock) => sum + stock.allocation, 0)

    if (totalAllocation !== 100 && updatedContinuingStocks.length > 0) {
      // Find an unlocked continuing stock to adjust
      const adjustmentStock = finalStocks.find((stock) => !stock.locked && existingStockIds.includes(stock.id))

      if (adjustmentStock) {
        adjustmentStock.allocation += 100 - totalAllocation
      }
    }

    setStocks(finalStocks)

    // If basket was already locked, update the updated date
    if (basketLocked) {
      setBasketDates({
        ...basketDates,
        updated: new Date(),
      })
    }
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

  const weightedData = calculateWeightedSentiment()

  // Update the handleWeightChange function to ensure weights sum to 100%
  const handleWeightChange = (source, value) => {
    const newValue = Number.parseFloat(value[0])

    // Calculate how much we need to adjust other weights to maintain sum = 1
    const otherSources = Object.keys(weights).filter((key) => key !== source)

    // Calculate the total weight that should be distributed among other sources
    const remainingWeight = 1 - newValue

    // Calculate the current sum of other weights
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
      })
    }

    // Ensure all weights are non-negative and sum to 1
    Object.keys(newWeights).forEach((key) => {
      newWeights[key] = Math.max(0, newWeights[key])
    })

    // Normalize to ensure sum is exactly 1
    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0)
    if (sum > 0) {
      Object.keys(newWeights).forEach((key) => {
        newWeights[key] = newWeights[key] / sum
      })
    }

    setWeights(newWeights)
  }

  // Function to handle clicking on a stock
  const handleStockClick = (stock) => {
    if (!stock) return // Guard clause to prevent clicking on undefined stock

    // Find the full stock data with price
    const stockWithPrice = stockPerformanceData.find((s) => s.id === stock.id) || {
      ...stock,
      price: 100, // Default price if not found
      change: 0, // Default change if not found
    }

    setSelectedStock(stockWithPrice)
  }

  // Function to toggle lock status of a stock
  const handleToggleLock = (stockId) => {
    setStocks(stocks.map((stock) => (stock.id === stockId ? { ...stock, locked: !stock.locked } : stock)))
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

  // Function to update stock allocation
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
          const proportion = stock.allocation / totalUnlockedAllocation
          // Reduce this stock's allocation proportionally
          stock.allocation = Math.max(1, stock.allocation - difference * proportion)
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
      newsSentiment: weightedData[weightedData.length - 1].newsSentiment,
      compositeSentiment: weightedData[weightedData.length - 1].compositeSentiment,
    }
  })

  // Color function for sentiment
  const getSentimentColor = (value) => {
    if (value > 0.3) return "text-emerald-500"
    if (value >= -0.3) return "text-amber-500"
    return "text-red-500"
  }

  // Color function for performance
  const getPerformanceColor = (value) => {
    if (value > 0) return "text-emerald-500"
    return "text-red-500"
  }

  // Get sentiment icon
  const getSentimentIcon = (value) => {
    if (value > 0.3) return <ArrowUp className="h-4 w-4 text-emerald-500" />
    if (value >= -0.3) return <Activity className="h-4 w-4 text-amber-500" />
    return <ArrowDown className="h-4 w-4 text-red-500" />
  }

  // Get overall sentiment status
  const getOverallSentiment = () => {
    const latestComposite = weightedData[weightedData.length - 1].compositeSentiment

    if (latestComposite > 0.5) return { text: "Very Positive", color: "bg-emerald-500" }
    if (latestComposite > 0.2) return { text: "Positive", color: "bg-emerald-400" }
    if (latestComposite > -0.2) return { text: "Neutral", color: "bg-amber-400" }
    if (latestComposite > -0.5) return { text: "Negative", color: "bg-red-400" }
    return { text: "Very Negative", color: "bg-red-500" }
  }

  const overallSentiment = getOverallSentiment()

  // Function to handle locking in the basket
  const handleLockBasket = () => {
    // Set basket as locked
    setBasketLocked(true)

    // Set creation date if this is the first time locking
    if (!basketDates.created) {
      const now = new Date()
      setBasketDates({
        created: now,
        updated: now,
      })
    }

    // Scroll to the basket tracking section
    setTimeout(() => {
      const trackingSection = document.getElementById("tracking-section")
      if (trackingSection) {
        trackingSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A"
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen p-6">
      {selectedStock ? (
        <StockDetailView stock={selectedStock} onBack={() => setSelectedStock(null)} timePeriod={timePeriod} />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis Dashboard</h1>
              <p className="text-slate-400 mt-1">Track market sentiment across multiple data sources</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={`${overallSentiment.color} px-3 py-1.5 text-white`}>{overallSentiment.text}</Badge>
              <Tabs defaultValue={timePeriod} onValueChange={setTimePeriod} className="w-[200px]">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="1d">1D</TabsTrigger>
                  <TabsTrigger value="1w">1W</TabsTrigger>
                  <TabsTrigger value="1m">1M</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Inputs Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Inputs</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection("inputs")}>
                {sectionsCollapsed.inputs ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              </Button>
            </div>

            {!sectionsCollapsed.inputs && (
              <>
                {/* Stock Allocation */}
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Stock Allocation
                        </CardTitle>
                        <CardDescription>
                          Adjust your portfolio allocation and lock in positions based on sentiment
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        onClick={() => setIsStockSelectorOpen(true)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Basket
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stocks.map((stock) => {
                        const stockData = stockPerformanceData.find((s) => s.id === stock.id) || stock
                        return (
                          <div key={stock.id} className="flex items-center gap-4">
                            <div className="w-20 font-medium">{stock.symbol}</div>
                            <div className="flex-1">
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${stockData.compositeSentiment > 0.3 ? "bg-emerald-500" : stockData.compositeSentiment > -0.3 ? "bg-amber-500" : "bg-red-500"}`}
                                  style={{ width: `${stock.allocation}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-12 text-right">{stock.allocation}%</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleLock(stock.id)}
                            >
                              {stock.locked ? (
                                <Lock className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Unlock className="h-4 w-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-400">
                        <span className="font-medium text-white">{stocks.filter((s) => s.locked).length}</span> of{" "}
                        {stocks.length} positions locked
                      </div>
                      <Button size="sm" variant="outline" onClick={handleResetAllocations} className="gap-1">
                        <RotateCw className="h-3.5 w-3.5" />
                        Reset
                      </Button>
                    </div>
                    <Button size="sm" onClick={() => setIsAllocationEditorOpen(true)}>
                      Adjust Allocations
                    </Button>
                  </CardFooter>
                </Card>

                {/* Source Weighting and Correlation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Source Weighting Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Source Weighting
                      </CardTitle>
                      <CardDescription>
                        Adjust the influence of each data source on the composite sentiment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-400 font-medium">Twitter</label>
                            <span className="text-sm font-medium bg-slate-800 px-2 py-0.5 rounded">
                              {(weights.twitter * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Slider
                            defaultValue={[weights.twitter]}
                            max={1}
                            step={0.05}
                            onValueChange={(value) => handleWeightChange("twitter", value)}
                            className="py-1"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-400 font-medium">Google Trends</label>
                            <span className="text-sm font-medium bg-slate-800 px-2 py-0.5 rounded">
                              {(weights.googleTrends * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Slider
                            defaultValue={[weights.googleTrends]}
                            max={1}
                            step={0.05}
                            onValueChange={(value) => handleWeightChange("googleTrends", value)}
                            className="py-1"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-400 font-medium">News</label>
                            <span className="text-sm font-medium bg-slate-800 px-2 py-0.5 rounded">
                              {(weights.news * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Slider
                            defaultValue={[weights.news]}
                            max={1}
                            step={0.05}
                            onValueChange={(value) => handleWeightChange("news", value)}
                            className="py-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sentiment-Performance Correlation */}
                  <CorrelationChart stocks={stocks} weights={weights} />
                </div>

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
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-6 text-lg w-full md:w-auto mt-4 md:mt-6"
                    onClick={handleLockBasket}
                    disabled={!basketName.trim()}
                  >
                    Lock in Basket
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Basket Tracking Section - Only shown after basket is locked */}
          {basketLocked && (
            <div className="mb-8" id="tracking-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Basket Tracking</h2>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection("tracking")}>
                  {sectionsCollapsed.tracking ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </Button>
              </div>

              {!sectionsCollapsed.tracking && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basket Details */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Basket Details
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1"
                          onClick={() => setIsStockSelectorOpen(true)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </div>
                      <CardDescription>Information about the current stock basket</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-1 border-b border-slate-800">
                          <span className="text-slate-400">Name</span>
                          <span className="font-medium">{basketName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800">
                          <span className="text-slate-400">Stocks</span>
                          <span className="font-medium">{stocks.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800">
                          <span className="text-slate-400">Locked Positions</span>
                          <span className="font-medium">
                            {stocks.filter((s) => s.locked).length} of {stocks.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800">
                          <span className="text-slate-400">Created</span>
                          <span className="font-medium">{formatDate(basketDates.created)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400">Last Updated</span>
                          <span className="font-medium">{formatDate(basketDates.updated)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stock Performance Table */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Stock Basket Performance
                          </CardTitle>
                          <CardDescription>Performance metrics correlated with sentiment analysis</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-4 font-medium text-slate-400">Symbol</th>
                              <th className="text-right py-3 px-4 font-medium text-slate-400">Sentiment</th>
                              <th className="text-right py-3 px-4 font-medium text-slate-400">Performance</th>
                              <th className="text-center py-3 px-4 font-medium text-slate-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stockPerformanceData.map((stock) => (
                              <tr
                                key={stock.id}
                                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer"
                                onClick={() => handleStockClick(stock)}
                              >
                                <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                                <td className="py-3 px-4 text-right font-medium">
                                  <div className="flex items-center justify-end gap-1">
                                    {getSentimentIcon(stock.compositeSentiment)}
                                    <span className={getSentimentColor(stock.compositeSentiment)}>
                                      {stock.compositeSentiment.toFixed(2)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-bold">
                                  <div className="flex items-center justify-end gap-1">
                                    {stock.performance > 0 ? (
                                      <ArrowUp className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <ArrowDown className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className={getPerformanceColor(stock.performance)}>
                                      {stock.performance > 0 ? "+" : ""}
                                      {stock.performance}%
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {stock.locked ? (
                                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                                      Locked
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-slate-500 text-slate-500">
                                      Flexible
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Premium Insights Section - Only shown after basket is locked */}
          {basketLocked && (
            <div className="mb-8" id="insights-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Premium Insights</h2>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection("insights")}>
                  {sectionsCollapsed.insights ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </Button>
              </div>

              {!sectionsCollapsed.insights && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {premiumFeatures.map((feature, index) => (
                      <Card
                        key={index}
                        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-700 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-500 px-2 py-1 text-xs font-medium rounded-bl">
                          PREMIUM
                        </div>
                        <CardContent className="p-6 flex flex-col items-center text-center mt-4">
                          <div className="rounded-full bg-amber-500/20 p-3 mb-4">
                            <div className="text-amber-500">{feature.icon}</div>
                          </div>
                          <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">{feature.description}</p>
                          <div className="text-3xl font-bold text-amber-500 mb-1">{feature.value}</div>
                          <p className="text-sm text-slate-400">{feature.comparison}</p>
                        </CardContent>
                        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-sm">
                          <div className="text-center p-6">
                            <Lock className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold mb-2">Premium Feature</h3>
                            <p className="text-sm text-slate-400 mb-4">
                              Unlock detailed insights with a premium subscription
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="mb-8 border-amber-500/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-amber-500" />
                        Detailed Sentiment-Price Analysis
                      </CardTitle>
                      <CardDescription>
                        Premium users get access to advanced correlation analysis between sentiment and price movements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-slate-800/50 rounded-md">
                      <div className="text-center p-6 max-w-md">
                        <Lock className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Premium Chart</h3>
                        <p className="text-sm text-slate-400 mb-6">
                          Unlock detailed sentiment-price correlation charts, historical benchmarks, and predictive
                          indicators
                        </p>
                        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                          Upgrade to Premium
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© 2025 Sentiment Analysis Dashboard. Data refreshes every 15 minutes.</p>
          </div>
          <StockSelector
            open={isStockSelectorOpen}
            onOpenChange={setIsStockSelectorOpen}
            initialStocks={stocks}
            onSave={handleSaveStocks}
          />
          <StockAllocation
            open={isAllocationEditorOpen}
            onOpenChange={setIsAllocationEditorOpen}
            stocks={stocks}
            onSave={handleSaveStocks}
            onAllocationChange={handleAllocationChange}
            onToggleLock={handleToggleLock}
          />
        </>
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
