import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/context/theme-context"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sentiment Dashboard",
  description: "Track market sentiment across multiple data sources",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-[1200px] mx-auto px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-6 overflow-x-auto">
                      <Link href="/" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                        Home
                      </Link>
                      <Link
                        href="/google-trend-signals"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Google Trends
                      </Link>
                      <Link
                        href="/twitter-signals"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Twitter Signals
                      </Link>
                      <Link
                        href="/news-signals"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        News Signals
                      </Link>
                      <Link
                        href="/trade-signals"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Trade Signals
                      </Link>
                      <Link
                        href="/performance"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Performance
                      </Link>
                      <Link
                        href="/stock-signal"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Stock Signal
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ThemeToggle />
                      <UserNav />
                    </div>
                  </div>
                </div>
              </nav>
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
