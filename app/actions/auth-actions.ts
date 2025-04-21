"use server"

import { cookies } from "next/headers"
import { createClient } from 'redis'
import { redirect } from "next/navigation"
import { createHash } from "crypto"

// Initialize Redis client
const redis = createClient({
  url: process.env.REDIS_URL
})

// Connect to Redis (this is needed for the standard Redis client)
const getRedisClient = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
  return redis
}

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Login function
export async function login(email: string, password: string) {
  try {
    const client = await getRedisClient()
    
    // Get user from Redis
    const userJson = await client.get(`user:${email}`)

    if (!userJson) {
      return { success: false, error: "Invalid email or password" }
    }

    // Parse the JSON string
    const user = JSON.parse(userJson)

    // Check password
    const hashedPassword = hashPassword(password)
    if (hashedPassword !== user.password) {
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

    // Store session in Redis (stringify the object)
    await client.set(`session:${sessionId}`, JSON.stringify(session))

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
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
    try {
      const client = await getRedisClient()
      // Delete session from Redis
      await client.del(`session:${sessionId}`)
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Delete cookie
    cookies().delete("session_id")
  }

  redirect("/login")
}

// Register function
export async function register(email: string, password: string, name: string) {
  try {
    const client = await getRedisClient()
    
    // Check if user already exists
    const existingUser = await client.get(`user:${email}`)

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

    // Store user in Redis (stringify the object)
    await client.set(`user:${email}`, JSON.stringify(user))

    // Create empty basket for user
    await client.set(`basket:${email}`, JSON.stringify([]))

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
    const client = await getRedisClient()
    
    const sessionJson = await client.get(`session:${sessionId}`)

    if (!sessionJson) {
      return null
    }

    // Parse the JSON string
    const session = JSON.parse(sessionJson)

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await client.del(`session:${sessionId}`)
      cookies().delete("session_id")
      return null
    }

    const userJson = await client.get(`user:${session.email}`)

    if (!userJson) {
      return null
    }

    // Parse the JSON string
    const user = JSON.parse(userJson)

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
