import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from 'redis'

// List of paths that don't require authentication
const publicPaths = ["/login", "/register", "/forgot-password"]

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

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  const path = request.nextUrl.pathname

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

  // If no session and not a public path, redirect to login
  if (!sessionId && !isPublicPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", encodeURIComponent(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // If has session and trying to access login/register, redirect to dashboard
  if (sessionId && isPublicPath) {
    try {
      const client = await getRedisClient()
      const sessionJson = await client.get(`session:${sessionId}`)

      if (sessionJson) {
        const session = JSON.parse(sessionJson)
        
        // Check if session is valid
        if (session && session.expiresAt > Date.now()) {
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    } catch (error) {
      // If error checking session, continue to the page
      console.error("Error checking session:", error)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
  ],
}
