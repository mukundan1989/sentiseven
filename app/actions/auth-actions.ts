"use server"

import { cookies } from "next/headers"
import { kv } from "@vercel/kv"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Login function
export async function login(email: string, password: string) {
  try {
    // Get user from KV store
    const user = await kv.get(`user:${email}`)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const hashedPassword = hashPassword(password)
    if (hashedPassword !== (user as any).password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const session = {
      id: sessionId,
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    // Store session in KV
    await kv.set(`session:${sessionId}`, session)

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      sameSite: "lax",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

// Logout function
export async function logout() {
  const sessionId = cookies().get("session_id")?.value

  if (sessionId) {
    // Delete session from KV
    await kv.del(`session:${sessionId}`)

    // Delete cookie
    cookies().delete("session_id")
  }

  redirect("/login")
}

// Register function
export async function register(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`)

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Create new user
    const user = {
      email,
      name,
      password: hashPassword(password),
      createdAt: Date.now(),
    }

    // Store user in KV
    await kv.set(`user:${email}`, user)

    // Create empty basket for user
    await kv.set(`basket:${email}`, [])

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

// Get current user
export async function getCurrentUser() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return null
  }

  try {
    const session = await kv.get(`session:${sessionId}`)

    if (!session) {
      return null
    }

    // Check if session is expired
    if ((session as any).expiresAt < Date.now()) {
      await kv.del(`session:${sessionId}`)
      cookies().delete("session_id")
      return null
    }

    const user = await kv.get(`user:${(session as any).email}`)

    if (!user) {
      return null
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user as any
    return userWithoutPassword
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
