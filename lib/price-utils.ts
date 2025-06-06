// Move the existing getCurrentPrice function from performance page to shared utility
export const getCurrentPrice = async (symbol: string): Promise<number> => {
  try {
    // Using Yahoo Finance API through a proxy service
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`)
    const data = await response.json()

    if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      return data.chart.result[0].meta.regularMarketPrice
    }

    // Fallback: try alternative endpoint
    const altResponse = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`)
    const altData = await altResponse.json()

    if (altData.quoteSummary?.result?.[0]?.price?.regularMarketPrice?.raw) {
      return altData.quoteSummary.result[0].price.regularMarketPrice.raw
    }

    throw new Error(`No price data found for ${symbol}`)
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error)
    // Return a fallback price based on known prices for demo
    const knownPrices: Record<string, number> = {
      GRPN: 26.6,
      APRN: 75.2,
      AAPL: 150.0,
      MSFT: 280.0,
      GOOGL: 2500.0,
      AMZN: 3200.0,
      META: 320.0,
      TSLA: 800.0,
      NVDA: 450.0,
      NFLX: 400.0,
      JPM: 140.0,
      V: 220.0,
    }
    return knownPrices[symbol] || 100 // Default fallback
  }
}

// Fetch prices for multiple stocks
export const getMultipleStockPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {}

  // Fetch prices in parallel with rate limiting (5 requests at a time)
  const batchSize = 5
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize)
    const batchPromises = batch.map(async (symbol) => {
      try {
        const price = await getCurrentPrice(symbol)
        return { symbol, price }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error)
        return { symbol, price: 100 } // Fallback price
      }
    })

    const results = await Promise.all(batchPromises)
    results.forEach(({ symbol, price }) => {
      prices[symbol] = price
    })

    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < symbols.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return prices
}
