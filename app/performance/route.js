import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(req) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get("symbol")
  const type = url.searchParams.get("type") // metrics, data, or cumulative-pl

  if (!symbol) {
    return Response.json({ error: "Symbol parameter is required" }, { status: 400 })
  }

  if (!type || !["metrics", "data", "cumulative-pl"].includes(type)) {
    return Response.json(
      { error: "Valid type parameter is required (metrics, data, or cumulative-pl)" },
      { status: 400 },
    )
  }

  try {
    let result

    if (type === "metrics") {
      // Win percentage query
      const { data: winPercentageData, error: winPercentageError } = await supabase
        .from("models_performance")
        .select("30d_pl, 60d_pl, sentiment")
        .eq("comp_symbol", symbol)
        .neq("sentiment", "neutral")

      if (winPercentageError) throw winPercentageError

      const totalSignals = winPercentageData.length
      let winningSignals = 0
      if (totalSignals > 0) {
        winningSignals = winPercentageData.filter((row) => row["30d_pl"] > 0 || row["60d_pl"] > 0).length
      }
      const winPercentage = totalSignals > 0 ? Math.round((winningSignals / totalSignals) * 100) : "N/A"

      // Total trades query
      const totalTrades = totalSignals !== null ? totalSignals : "N/A"

      // Profit factor query
      let totalProfit = 0
      let totalLoss = 0
      if (winPercentageData.length > 0) {
        winPercentageData.forEach((row) => {
          if (row["30d_pl"] > 0) {
            totalProfit += row["30d_pl"]
          } else if (row["30d_pl"] < 0) {
            totalLoss += row["30d_pl"]
          }
        })
      }
      const profitFactor = totalLoss !== 0 ? (totalProfit / Math.abs(totalLoss)).toFixed(2) : "N/A"

      result = {
        win_percentage: winPercentage,
        total_trades: totalTrades,
        profit_factor: profitFactor,
      }
    } else if (type === "data") {
      const { data, error } = await supabase
        .from("models_performance")
        .select("date, sentiment, entry_price, 30d_pl, 60d_pl")
        .eq("comp_symbol", symbol)
        .neq("sentiment", "neutral")

      if (error) throw error
      result = data
    } else if (type === "cumulative-pl") {
      const { data, error } = await supabase
        .from("models_performance")
        .select("date, 30d_pl")
        .eq("comp_symbol", symbol)
        .neq("sentiment", "neutral")
        .order("date", { ascending: true })

      if (error) throw error

      // Calculate cumulative P/L
      let cumulativePL = 0
      result = data.map((row) => {
        cumulativePL += Number(row["30d_pl"])
        return {
          date: row.date,
          daily_pl: Number(row["30d_pl"]),
          cumulative_pl: cumulativePL,
        }
      })
    }

    return Response.json(result)
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error)
    return Response.json({ error: `Failed to fetch ${type} data: ${error.message}` }, { status: 500 })
  }
}
