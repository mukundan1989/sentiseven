import yahooFinance from "yahoo-finance2"

// Cache for stock prices to ensure consistency between requests
const priceCache = {}

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

    if (!symbol) {
      return Response.json({ error: "Symbol is required" }, { status: 400 })
    }

    console.log(`Fetching current price for ${symbol}`)

    // Check if we have a cached price for this symbol
    if (priceCache[symbol]) {
      console.log(`Using cached price for ${symbol}: ${priceCache[symbol]}`)
      return Response.json({
        symbol: symbol,
        price: priceCache[symbol],
        currency: "USD",
        marketState: "REGULAR",
        lastUpdated: new Date().toISOString(),
        source: "cache",
      })
    }

    // Try to get real data from Yahoo Finance
    try {
      // Get current quote data
      const quote = await yahooFinance.quote(symbol)

      if (quote && quote.regularMarketPrice) {
        // Cache the price
        priceCache[symbol] = quote.regularMarketPrice

        console.log(`Got real price for ${symbol}: ${quote.regularMarketPrice}`)
        return Response.json({
          symbol: symbol,
          price: quote.regularMarketPrice,
          currency: quote.currency || "USD",
          marketState: quote.marketState,
          lastUpdated: new Date().toISOString(),
          source: "yahoo",
        })
      }
    } catch (yahooError) {
      console.error(`Yahoo Finance API error for ${symbol}:`, yahooError)
      // Continue to fallback
    }

    // Fallback to mock prices (consistent, not random)
    const mockPrice = mockPrices[symbol] || generateConsistentPrice(symbol)

    // Cache the mock price
    priceCache[symbol] = mockPrice

    console.log(`Using mock price for ${symbol}: ${mockPrice}`)
    return Response.json({
      symbol: symbol,
      price: mockPrice,
      currency: "USD",
      marketState: "CLOSED",
      lastUpdated: new Date().toISOString(),
      source: "mock",
    })
  } catch (error) {
    console.error(`Error in stock price API for ${params.symbol}:`, error)

    // Even in case of error, return a consistent price
    const fallbackPrice = mockPrices[params.symbol] || generateConsistentPrice(params.symbol)

    return Response.json({
      symbol: params.symbol,
      price: fallbackPrice,
      currency: "USD",
      marketState: "ERROR",
      lastUpdated: new Date().toISOString(),
      source: "error-fallback",
      error: error.message,
    })
  }
}

// Generate a consistent price based on the symbol's characters
function generateConsistentPrice(symbol) {
  // This ensures the same symbol always gets the same price
  const symbolSum = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const basePrice = (symbolSum % 490) + 10 // Price between $10 and $500
  return Math.round(basePrice * 100) / 100
}
