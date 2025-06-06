import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { getMultipleStockPrices } from "./price-utils"

export type StockBasket = {
  id?: string
  name: string
  source_weights: { [key: string]: number }
  is_locked: boolean
  created_at?: string
  updated_at?: string
  locked_at?: string
  lock_prices?: { [key: string]: number }
}

export type BasketStock = {
  symbol: string
  name: string
  sector?: string
  allocation: number
  is_locked: boolean
}

// Get all baskets for the current user
export async function getAllUserBaskets(): Promise<{
  baskets: StockBasket[] | null
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { baskets: null, error: new Error("User not authenticated") }
    }

    // Get all baskets for this user
    const { data: baskets, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (basketError) {
      console.error("Error fetching baskets:", basketError)
      return { baskets: null, error: basketError }
    }

    return { baskets: baskets || [], error: null }
  } catch (error) {
    console.error("Error getting user baskets:", error)
    return { baskets: null, error: error as Error }
  }
}

// Get a specific basket with its stocks
export async function getBasketById(basketId: string): Promise<{
  basket: StockBasket | null
  stocks: BasketStock[] | null
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { basket: null, stocks: null, error: new Error("User not authenticated") }
    }

    // Get the specific basket
    const { data: baskets, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("id", basketId)
      .eq("user_id", user.id)
      .limit(1)

    if (basketError) {
      console.error("Error fetching basket:", basketError)
      return { basket: null, stocks: null, error: basketError }
    }

    if (!baskets || baskets.length === 0) {
      return { basket: null, stocks: null, error: new Error("Basket not found") }
    }

    const basket = baskets[0]

    // Get the stocks for this basket
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("*")
      .eq("basket_id", basket.id)

    if (stocksError) {
      console.error("Error fetching stocks:", stocksError)
      return { basket, stocks: null, error: stocksError }
    }

    return { basket, stocks, error: null }
  } catch (error) {
    console.error("Error getting basket by ID:", error)
    return { basket: null, stocks: null, error: error as Error }
  }
}

// Get the most recent basket for the current user
export async function getMostRecentBasket(): Promise<{
  basket: StockBasket | null
  stocks: BasketStock[] | null
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { basket: null, stocks: null, error: new Error("User not authenticated") }
    }

    // Get the most recent basket
    const { data: baskets, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)

    if (basketError) {
      console.error("Error fetching baskets:", basketError)
      return { basket: null, stocks: null, error: basketError }
    }

    if (!baskets || baskets.length === 0) {
      return { basket: null, stocks: null, error: null }
    }

    const basket = baskets[0]

    // Get the stocks for this basket
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("*")
      .eq("basket_id", basket.id)

    if (stocksError) {
      console.error("Error fetching stocks:", stocksError)
      return { basket, stocks: null, error: stocksError }
    }

    return { basket, stocks, error: null }
  } catch (error) {
    console.error("Error getting most recent basket:", error)
    return { basket: null, stocks: null, error: error as Error }
  }
}

// Save a new basket or update an existing one
export async function saveBasket(
  basketData: StockBasket,
  stocks: BasketStock[],
  forceNew = false,
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
    const now = new Date().toISOString()

    // If forceNew is true or no basket ID, create a new basket
    if (forceNew || !basketId) {
      basketId = uuidv4()

      // Insert the basket
      const { error: basketError } = await supabase.from("stock_baskets").insert({
        id: basketId,
        user_id: user.id,
        name: basketData.name,
        created_at: now,
        updated_at: now,
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
        locked_at: basketData.is_locked ? now : null,
        lock_prices: basketData.lock_prices || null,
      })

      if (basketError) {
        console.error("Error creating basket:", basketError)
        return { error: basketError, basketId: null }
      }
    } else {
      // Update existing basket
      console.log("Updating existing basket:", basketId, "with data:", {
        name: basketData.name,
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
      })

      const updateData: any = {
        name: basketData.name,
        updated_at: now,
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
      }

      // If locking the basket, set locked_at and lock_prices
      if (basketData.is_locked) {
        updateData.locked_at = now
        updateData.lock_prices = basketData.lock_prices
      }

      const { error: basketError } = await supabase
        .from("stock_baskets")
        .update(updateData)
        .eq("id", basketId)
        .eq("user_id", user.id)

      if (basketError) {
        console.error("Error updating basket:", basketError)
        return { error: basketError, basketId: null }
      }

      console.log("Basket updated successfully")
    }

    // Delete existing stocks for this basket (we'll replace them)
    if (basketId) {
      console.log("Deleting existing stocks for basket:", basketId)
      const { error: deleteError } = await supabase.from("basket_stocks").delete().eq("basket_id", basketId)

      if (deleteError) {
        console.error("Error deleting existing stocks:", deleteError)
        return { error: deleteError, basketId: null }
      }
      console.log("Existing stocks deleted successfully")
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

    console.log("Inserting stocks:", stocksToInsert.length, "stocks")
    const { error: stocksError } = await supabase.from("basket_stocks").insert(stocksToInsert)

    if (stocksError) {
      console.error("Error inserting stocks:", stocksError)
      return { error: stocksError, basketId: null }
    }

    console.log("Stocks inserted successfully")

    return { error: null, basketId }
  } catch (error) {
    console.error("Error saving basket:", error)
    return { error: error as Error, basketId: null }
  }
}

// Lock basket with current stock prices
export async function lockBasketWithPrices(
  basketId: string,
  userId: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // First, get the basket to verify ownership and get stocks
    const { data: basket, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("id", basketId)
      .eq("user_id", userId)
      .single()

    if (basketError || !basket) {
      console.error("Error fetching basket:", basketError)
      return { success: false, error: "Basket not found or access denied" }
    }

    // Get the stocks in this basket
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("symbol")
      .eq("basket_id", basketId)

    if (stocksError || !stocks) {
      console.error("Error fetching basket stocks:", stocksError)
      return { success: false, error: "Failed to fetch basket stocks" }
    }

    const stockSymbols = stocks.map((stock) => stock.symbol)

    // Fetch current prices for all stocks in the basket
    console.log("Fetching current prices for stocks:", stockSymbols)
    const lockPrices = await getMultipleStockPrices(stockSymbols)
    console.log("Lock prices:", lockPrices)

    // Update the basket with lock status and prices
    const { error: updateError } = await supabase
      .from("stock_baskets")
      .update({
        is_locked: true,
        locked_at: new Date().toISOString(),
        lock_prices: lockPrices,
      })
      .eq("id", basketId)
      .eq("user_id", userId)

    if (updateError) {
      console.error("Error locking basket:", updateError)
      return { success: false, error: "Failed to lock basket" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in lockBasketWithPrices:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Unlock a basket
export async function unlockBasket(
  basketId: string,
  userId: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase
      .from("stock_baskets")
      .update({
        is_locked: false,
        locked_at: null,
        // We keep the lock_prices for historical reference
      })
      .eq("id", basketId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error unlocking basket:", error)
      return { success: false, error: "Failed to unlock basket" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in unlockBasket:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Delete a basket
export async function deleteBasket(basketId: string): Promise<{ error: Error | null }> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: new Error("User not authenticated") }
    }

    // Delete stocks first
    const { error: stocksError } = await supabase.from("basket_stocks").delete().eq("basket_id", basketId)

    if (stocksError) {
      console.error("Error deleting basket stocks:", stocksError)
      return { error: stocksError }
    }

    // Delete the basket
    const { error: basketError } = await supabase
      .from("stock_baskets")
      .delete()
      .eq("id", basketId)
      .eq("user_id", user.id)

    if (basketError) {
      console.error("Error deleting basket:", basketError)
      return { error: basketError }
    }

    return { error: null }
  } catch (error) {
    console.error("Error deleting basket:", error)
    return { error: error as Error }
  }
}
