import { createClient } from "@supabase/supabase-js"

// Default to empty strings during build to prevent errors
// These will be properly set in the actual runtime environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only create the client if we're in a browser environment or if the variables are set
const createSupabaseClient = () => {
  // During build time, return a mock client to prevent errors
  if (typeof window === "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn("Supabase environment variables are missing. Using mock client during build.")
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({}),
        signOut: async () => ({}),
        resetPasswordForEmail: async () => ({}),
      },
    } as any
  }

  // In browser or when variables are set, create a real client
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
