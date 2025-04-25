"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { getSupabase } from "../utils/supabaseClient"

type AuthContextType = {
  session: Session | null
  user: User | null
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null; data: any }>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  signOut: async () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return

    const supabase = getSupabase()

    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user || null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: error as Error }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })
      return { data, error }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: error as Error, data: null }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const supabase = getSupabase()
      // Use the environment variable instead of window.location.origin
      const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      })
    } catch (error) {
      console.error("Google sign in error:", error)
    }
  }

  // Sign in with GitHub
  const signInWithGithub = async () => {
    try {
      const supabase = getSupabase()
      // Use the environment variable instead of window.location.origin
      const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: redirectUrl },
      })
    } catch (error) {
      console.error("GitHub sign in error:", error)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value = {
    session,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
