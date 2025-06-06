import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export type StockBasket = {
  id?: string
  name: string
  source_weights: { [key: string]: number }
  is_locked: boolean
  created_at?: string
  updated_at?: string
  locked_at?: string // New field to track when basket was locked
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

    // If forceNew is true or no basket ID, create a new basket
    if (forceNew || !basketId) {
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
        locked_at: basketData.is_locked ? new Date().toISOString() : null, // Set locked_at if basket is locked
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

      const now = new Date().toISOString()

      // Determine if we're locking the basket
      const { data: currentBasket, error: fetchError } = await supabase
        .from("stock_baskets")
        .select("is_locked")
        .eq("id", basketId)
        .single()

      if (fetchError) {
        console.error("Error fetching current basket state:", fetchError)
        return { error: fetchError, basketId: null }
      }

      // If we're locking the basket (wasn't locked before but is now), set locked_at
      const isNewlyLocked = !currentBasket.is_locked && basketData.is_locked

      const { error: basketError } = await supabase
        .from("stock_baskets")
        .update({
          name: basketData.name,
          updated_at: now,
          source_weights: basketData.source_weights,
          is_locked: basketData.is_locked,
          locked_at: isNewlyLocked ? now : currentBasket.locked_at, // Only update locked_at if newly locked
        })
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

// Unlock a basket
export async function unlockBasket(basketId: string): Promise<{ error: Error | null }> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: new Error("User not authenticated") }
    }

    // Update the basket to unlock it
    const { error: basketError } = await supabase
      .from("stock_baskets")
      .update({
        is_locked: false,
        updated_at: new Date().toISOString(),
        // We don't clear locked_at because we want to preserve when it was last locked
      })
      .eq("id", basketId)
      .eq("user_id", user.id)

    if (basketError) {
      console.error("Error unlocking basket:", basketError)
      return { error: basketError }
    }

    return { error: null }
  } catch (error) {
    console.error("Error unlocking basket:", error)
    return { error: error as Error }
  }
}
