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

// Get the current user's basket
export async function GET() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await getRedisClient()
    const sessionJson = await client.get(`session:${sessionId}`)

    if (!sessionJson) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionJson)
    const email = session.email
    
    const basketJson = await client.get(`basket:${email}`)
    const basket = basketJson ? JSON.parse(basketJson) : []

    return NextResponse.json(basket)
  } catch (error) {
    console.error("Get basket error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update the current user's basket
export async function POST(request: Request) {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await getRedisClient()
    const sessionJson = await client.get(`session:${sessionId}`)

    if (!sessionJson) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionJson)
    const email = session.email
    
    const basket = await request.json()

    // Validate basket data
    if (!Array.isArray(basket)) {
      return NextResponse.json({ error: "Invalid basket data" }, { status: 400 })
    }

    // Save basket
    await client.set(`basket:${email}`, JSON.stringify(basket))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update basket error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
