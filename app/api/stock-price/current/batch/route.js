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

// Helper function to generate a consistent price based on the symbol's characters
function generateConsistentPrice(symbol) {
  const symbolSum = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const basePrice = (symbolSum % 490) + 10 // Price between $10 and $500
  return Math.round(basePrice * 100) / 100
}

export async function POST(request) {
  try {
    const { symbols } = await request.json()

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return Response.json({ error: "Symbols array is required" }, { status: 400 })
    }

    console.log(`Fetching current prices for ${symbols.length} symbols in batch mode.`)

    const pricePromises = symbols.map(async (symbol) => {
      // Check cache first
      if (priceCache[symbol]) {
        return {
          symbol: symbol,
          price: priceCache[symbol],
          currency: "USD",
          marketState: "REGULAR",
          lastUpdated: new Date().toISOString(),
          source: "cache",
        }
      }

      // Try to get real data from Yahoo Finance
      try {
        const quote = await yahooFinance.quote(symbol)
        if (quote && quote.regularMarketPrice) {
          priceCache[symbol] = quote.regularMarketPrice // Cache the price
          return {
            symbol: symbol,
            price: quote.regularMarketPrice,
            currency: quote.currency || "USD",
            marketState: quote.marketState,
            lastUpdated: new Date().toISOString(),
            source: "yahoo",
          }
        }
      } catch (yahooError) {
        console.warn(`Yahoo Finance API error for ${symbol} in batch:`, yahooError.message)
        // Fallback to mock prices if Yahoo Finance fails
      }

      // Fallback to mock prices
      const mockPrice = mockPrices[symbol] || generateConsistentPrice(symbol)
      priceCache[symbol] = mockPrice // Cache the mock price
      return {
        symbol: symbol,
        price: mockPrice,
        currency: "USD",
        marketState: "CLOSED",
        lastUpdated: new Date().toISOString(),
        source: "mock",
      }
    })

    const results = await Promise.all(pricePromises)
    const pricesMap = results.reduce((acc, item) => {
      acc[item.symbol] = item.price
      return acc
    }, {})

    return Response.json(pricesMap, { status: 200 })
  } catch (error) {
    console.error("Error in batch stock price API:", error)
    return Response.json({ error: "Failed to fetch batch prices" }, { status: 500 })
  }
}
