import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("twitter_signals_full")
      .select("date, comp_symbol, analyzed_tweets, sentiment_score, sentiment, entry_price")
      .order("date", { ascending: false }) // Order by date descending to get latest first

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ error: "Failed to fetch twitter signals" }, { status: 500 })
    }

    // Process data to get only the latest entry for each comp_symbol
    const latestSignals = {}
    for (const row of data) {
      if (!latestSignals[row.comp_symbol] || new Date(row.date) > new Date(latestSignals[row.comp_symbol].date)) {
        latestSignals[row.comp_symbol] = row
      }
    }

    // Convert back to array and sort by comp_symbol as in original query
    const result = Object.values(latestSignals).sort((a, b) => a.comp_symbol.localeCompare(b.comp_symbol))

    return Response.json(result)
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ error: "Failed to fetch twitter signals" }, { status: 500 })
  }
}
