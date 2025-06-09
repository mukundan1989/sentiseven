import yahooFinance from "yahoo-finance2"

// Cache for historical prices to ensure consistency
const historicalPriceCache = {}

// Mock historical prices for demo purposes - consistent values
const mockPrices = {
  AAPL: 175.43,
  MSFT: 325.76,
  GOOGL: 132.58,
  AMZN: 145.68,
  META: 302.55,
  TSLA: 238.45,
  NVDA: 437.92,
  NFLX: 412.34,
  JPM: 145.23,
  V: 235.67,
  GRPN: 26.6,
  APRN: 75.2,
}

export async function GET(request, { params }) {
  try {
    const { symbol } = params
    const url = new URL(request.url)
    const date = url.searchParams.get("date")

    if (!symbol) {
      return Response.json({ error: "Symbol is required" }, { status: 400 })
    }

    if (!date) {
      return Response.json({ error: "Date parameter is required" }, { status: 400 })
    }

    console.log(`Fetching historical price for ${symbol} on ${date}`)

    // Create a cache key using symbol and date
    const cacheKey = `${symbol}_${date}`

    // Check if we have a cached price for this symbol and date
    if (historicalPriceCache[cacheKey]) {
      console.log(`Using cached historical price for ${symbol} on ${date}: ${historicalPriceCache[cacheKey]}`)
      return Response.json({
        symbol: symbol,
        date: date,
        price: historicalPriceCache[cacheKey],
        source: "cache",
      })
    }

    // Try to get real data from Yahoo Finance
    try {
      // Parse the date and get the next day for the range
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      // Get historical data
      const historical = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: "1d",
      })

      if (historical && historical.length > 0) {
        const priceData = historical[0]

        // Cache the price
        historicalPriceCache[cacheKey] = priceData.close

        console.log(`Got real historical price for ${symbol} on ${date}: ${priceData.close}`)
        return Response.json({
          symbol: symbol,
          date: date,
          price: priceData.close,
          open: priceData.open,
          high: priceData.high,
          low: priceData.low,
          volume: priceData.volume,
          source: "yahoo",
        })
      }
    } catch (yahooError) {
      console.error(`Yahoo Finance API error for ${symbol} on ${date}:`, yahooError)
      // Continue to fallback
    }

    // Fallback to mock prices (consistent, not random)
    const mockPrice = generateConsistentHistoricalPrice(symbol, date)

    // Cache the mock price
    historicalPriceCache[cacheKey] = mockPrice

    console.log(`Using mock historical price for ${symbol} on ${date}: ${mockPrice}`)
    return Response.json({
      symbol: symbol,
      date: date,
      price: mockPrice,
      open: mockPrice * 0.99,
      high: mockPrice * 1.01,
      low: mockPrice * 0.98,
      volume: 1000000,
      source: "mock",
    })
  } catch (error) {
    console.error(`Error in historical price API for ${params.symbol}:`, error)

    // Even in case of error, return a consistent price
    const url = new URL(request.url)
    const date = url.searchParams.get("date")
    const fallbackPrice = generateConsistentHistoricalPrice(params.symbol, date)

    return Response.json({
      symbol: params.symbol,
      date: date,
      price: fallbackPrice,
      open: fallbackPrice * 0.99,
      high: fallbackPrice * 1.01,
      low: fallbackPrice * 0.98,
      volume: 1000000,
      source: "error-fallback",
      error: error.message,
    })
  }
}

// Generate a consistent price based on the symbol and date
function generateConsistentHistoricalPrice(symbol, date) {
  // Base price from our mock prices or generate one
  let basePrice = mockPrices[symbol]

  if (!basePrice) {
    // Generate a consistent base price from the symbol
    const symbolSum = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    basePrice = (symbolSum % 490) + 10 // Price between $10 and $500
  }

  // Adjust price based on date to create some variation but keep it consistent
  const dateObj = new Date(date)
  const dateSeed = dateObj.getDate() + dateObj.getMonth() * 31
  const adjustment = ((dateSeed % 20) - 10) / 100 // -10% to +10% adjustment

  const finalPrice = basePrice * (1 + adjustment)
  return Math.round(finalPrice * 100) / 100
}
