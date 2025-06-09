import yahooFinance from "yahoo-finance2"
import { URL } from "url"

export async function GET(request, { params }) {
  try {
    const { symbol } = params
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const date = searchParams.get("date")

    if (!symbol) {
      return Response.json({ error: "Symbol is required" }, { status: 400 })
    }

    if (!date) {
      return Response.json({ error: "Date parameter is required" }, { status: 400 })
    }

    console.log(`Fetching historical price for ${symbol} on ${date}`)

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

    if (!historical || historical.length === 0) {
      throw new Error(`No historical data found for ${symbol} on ${date}`)
    }

    const priceData = historical[0]

    return Response.json({
      symbol: symbol,
      date: date,
      price: priceData.close,
      open: priceData.open,
      high: priceData.high,
      low: priceData.low,
      volume: priceData.volume,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching historical price for ${params.symbol} on ${searchParams.get("date")}:`, error)

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
      date: searchParams.get("date"),
      price: mockPrice,
      open: mockPrice * 0.98,
      high: mockPrice * 1.02,
      low: mockPrice * 0.96,
      volume: 1000000,
      lastUpdated: new Date().toISOString(),
      isMockData: true,
    })
  }
}
