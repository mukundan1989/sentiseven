import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from 'redis'

// Initialize Redis client
const redis = createClient({
  url: process.env.REDIS_URL
})

// Connect to Redis
const getRedisClient = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
  return redis
}

export async function GET() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const client = await getRedisClient()
    const sessionJson = await client.get(`session:${sessionId}`)

    if (!sessionJson) {
      return NextResponse.json(null, { status: 401 })
    }

    const session = JSON.parse(sessionJson)

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await client.del(`session:${sessionId}`)
      cookies().delete("session_id")
      return NextResponse.json(null, { status: 401 })
    }

    const userJson = await client.get(`user:${session.email}`)

    if (!userJson) {
      return NextResponse.json(null, { status: 401 })
    }

    // Parse user data
    const user = JSON.parse(userJson)

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
