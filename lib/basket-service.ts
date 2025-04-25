import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Types for our basket data
export interface StockBasket {
  id?: string
  user_id?: string
  name: string
  created_at?: string
  updated_at?: string
  source_weights: {
    twitter: number
    googleTrends: number
    news: number
  }
  is_locked: boolean
}

export interface BasketStock {
  id?: string
  basket_id?: string
  symbol: string
  name: string
  sector: string
  allocation: number
  is_locked: boolean
}

// Save a new basket or update an existing one
export async function saveBasket(
  basketData: StockBasket,
  stocks: BasketStock[],
): Promise<{ error: Error | null; basketId: string | null }> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: new Error("User not authenticated"), basketId: null }
    }

    let basketId = basketData.id

    // If no basket ID, create a new basket
    if (!basketId) {
      basketId = uuidv4()

      // Insert the basket
      const { error: basketError } = await supabase.from("stock_baskets").insert({
        id: basketId,
        user_id: user.id,
        name: basketData.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
      })

      if (basketError) {
        console.error("Error creating basket:", basketError)
        return { error: basketError, basketId: null }
      }
    } else {
      // Update existing basket
      const { error: basketError } = await supabase
        .from("stock_baskets")
        .update({
          name: basketData.name,
          updated_at: new Date().toISOString(),
          source_weights: basketData.source_weights,
          is_locked: basketData.is_locked,
        })
        .eq("id", basketId)
        .eq("user_id", user.id)

      if (basketError) {
        console.error("Error updating basket:", basketError)
        return { error: basketError, basketId: null }
      }
    }

    // Delete existing stocks for this basket (we'll replace them)
    if (basketId) {
      const { error: deleteError } = await supabase.from("basket_stocks").delete().eq("basket_id", basketId)

      if (deleteError) {
        console.error("Error deleting existing stocks:", deleteError)
        return { error: deleteError, basketId: null }
      }
    }

    // Insert the stocks
    const stocksToInsert = stocks.map((stock) => ({
      id: uuidv4(),
      basket_id: basketId,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector || "Unknown",
      allocation: stock.allocation,
      is_locked: stock.is_locked,
    }))

    const { error: stocksError } = await supabase.from("basket_stocks").insert(stocksToInsert)

    if (stocksError) {
      console.error("Error inserting stocks:", stocksError)
      return { error: stocksError, basketId: null }
    }

    return { error: null, basketId }
  } catch (error) {
    console.error("Error saving basket:", error)
    return { error: error as Error, basketId: null }
  }
}

// Get the user's baskets
export async function getUserBaskets(): Promise<{ baskets: StockBasket[]; error: Error | null }> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { baskets: [], error: new Error("User not authenticated") }
    }

    // Get the baskets
    const { data: baskets, error } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting baskets:", error)
      return { baskets: [], error }
    }

    return { baskets: baskets || [], error: null }
  } catch (error) {
    console.error("Error getting baskets:", error)
    return { baskets: [], error: error as Error }
  }
}

// Get a specific basket with its stocks
export async function getBasketWithStocks(basketId: string): Promise<{
  basket: StockBasket | null
  stocks: BasketStock[]
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { basket: null, stocks: [], error: new Error("User not authenticated") }
    }

    // Get the basket
    const { data: basket, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("id", basketId)
      .eq("user_id", user.id)
      .single()

    if (basketError) {
      console.error("Error getting basket:", basketError)
      return { basket: null, stocks: [], error: basketError }
    }

    // Get the stocks
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("*")
      .eq("basket_id", basketId)

    if (stocksError) {
      console.error("Error getting stocks:", stocksError)
      return { basket, stocks: [], error: stocksError }
    }

    return { basket, stocks: stocks || [], error: null }
  } catch (error) {
    console.error("Error getting basket with stocks:", error)
    return { basket: null, stocks: [], error: error as Error }
  }
}

// Get the most recent basket for a user
export async function getMostRecentBasket(): Promise<{
  basket: StockBasket | null
  stocks: BasketStock[]
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { basket: null, stocks: [], error: new Error("User not authenticated") }
    }

    // Get the most recent basket
    const { data: baskets, error: basketsError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (basketsError) {
      console.error("Error getting baskets:", basketsError)
      return { basket: null, stocks: [], error: basketsError }
    }

    if (!baskets || baskets.length === 0) {
      return { basket: null, stocks: [], error: null }
    }

    const basket = baskets[0]

    // Get the stocks for this basket
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("*")
      .eq("basket_id", basket.id)

    if (stocksError) {
      console.error("Error getting stocks:", stocksError)
      return { basket, stocks: [], error: stocksError }
    }

    return { basket, stocks: stocks || [], error: null }
  } catch (error) {
    console.error("Error getting most recent basket:", error)
    return { basket: null, stocks: [], error: error as Error }
  }
}
