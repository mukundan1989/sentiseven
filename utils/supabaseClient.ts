// This is a client-side only file
"use client"

import { createClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (typeof window === "undefined") {
    // Return a mock client during server-side rendering
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({}),
        signOut: async () => ({}),
        updateUser: async () => ({}),
        resetPasswordForEmail: async () => ({}),
      },
    } as any
  }

  // Initialize the client only once in the browser
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are missing")
      // Return a mock client if variables are missing
      return {
        auth: {
          getSession: async () => ({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithOAuth: async () => ({}),
          signOut: async () => ({}),
          updateUser: async () => ({}),
          resetPasswordForEmail: async () => ({}),
        },
      } as any
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }

  return supabaseInstance
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabase() : null
