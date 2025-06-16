import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req) {
  try {
    const { signal_type, total_signals, positive_ratio, win_rate_percent, positive_signals, negative_signals } =
      await req.json()

    if (
      !signal_type ||
      total_signals === undefined ||
      positive_ratio === undefined ||
      win_rate_percent === undefined ||
      positive_signals === undefined ||
      negative_signals === undefined
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { data, error } = await supabase
      .from("signal_summaries")
      .upsert(
        {
          signal_type,
          total_signals,
          positive_ratio,
          win_rate_percent,
          positive_signals,
          negative_signals,
          last_updated_at: new Date().toISOString(),
        },
        { onConflict: "signal_type" }, // Upsert based on unique signal_type
      )
      .select()

    if (error) {
      console.error("Error upserting signal summary:", error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ message: "Signal summary saved successfully", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Unexpected error in POST /api/signal-summaries:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("signal_summaries").select("*")

    if (error) {
      console.error("Error fetching signal summaries:", error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error("Unexpected error in GET /api/signal-summaries:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
