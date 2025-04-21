import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { kv } from "@vercel/kv"

export async function GET() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const session = await kv.get(`session:${sessionId}`)

    if (!session) {
      return NextResponse.json(null, { status: 401 })
    }

    // Check if session is expired
    if ((session as any).expiresAt < Date.now()) {
      await kv.del(`session:${sessionId}`)
      cookies().delete("session_id")
      return NextResponse.json(null, { status: 401 })
    }

    const user = await kv.get(`user:${(session as any).email}`)

    if (!user) {
      return NextResponse.json(null, { status: 401 })
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user as any
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(null, { status: 500 })
  }
}
