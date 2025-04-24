"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Define the shape of our auth context
type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize the auth state
  useEffect(() => {
    // Get the current session
    const initializeAuth = async () => {
      setIsLoading(true)

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)

      // Set up a listener for auth changes
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setIsLoading(false)
      })

      setIsLoading(false)

      // Clean up the subscription when the component unmounts
      return () => {
        subscription.unsubscribe()
      }
    }

    initializeAuth()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!response.error) {
      router.push("/")
    }

    return response
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    // Sign up the user
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    // If successful and not using email confirmation, redirect to home
    if (
      !response.error &&
      response.data?.user &&
      !response.data.user.identities?.[0].identity_data?.email_confirmed_at
    ) {
      // If email confirmation is required, we'll show a message on the signup page
      return response
    }

    // If email confirmation is not required, redirect to home
    if (!response.error) {
      router.push("/")
    }

    return response
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  // Sign in with GitHub
  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  // Create the context value
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
  }

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
