import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

// This route is used for handling the OAuth callback
export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      const cookieStore = cookies()

      // For route handlers, we need to use createRouteHandlerClient
      // which is different from our client-side implementation
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)
    }
  } catch (error) {
    console.error("Auth callback error:", error)
    // Continue with redirect even if there's an error
  }

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", req.url))
}
