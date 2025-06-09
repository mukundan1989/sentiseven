import yahooFinance from "yahoo-finance2"

export async function GET(request, { params }) {
  try {
    const { symbol } = params

    if (!symbol) {
      return Response.json({ error: "Symbol is required" }, { status: 400 })
    }

    console.log(`Fetching current price for ${symbol}`)

    // Get current quote data
    const quote = await yahooFinance.quote(symbol)

    if (!quote || !quote.regularMarketPrice) {
      throw new Error(`No price data found for ${symbol}`)
    }

    return Response.json({
      symbol: symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency || "USD",
      marketState: quote.marketState,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching current price for ${params.symbol}:`, error)

    // Fallback to mock prices for development
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

    const mockPrice = mockPrices[params.symbol] || 100

    return Response.json({
      symbol: params.symbol,
      price: mockPrice,
      currency: "USD",
      marketState: "CLOSED",
      lastUpdated: new Date().toISOString(),
      isMockData: true,
    })
  }
}
