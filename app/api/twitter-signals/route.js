import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT date, comp_symbol, analyzed_tweets, sentiment_score, sentiment, entry_price
      FROM twitter_signals_full
      WHERE (comp_symbol, date) IN (
        SELECT comp_symbol, MAX(date)
        FROM twitter_signals_full
        GROUP BY comp_symbol
      )
      ORDER BY comp_symbol
    `)

    return Response.json(rows)
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ error: "Failed to fetch twitter signals" }, { status: 500 })
  }
}
