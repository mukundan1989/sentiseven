import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sentiment Dashboard",
  description: "Track market sentiment across multiple data sources",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen">
        <nav className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center space-x-6">
          <Link href="/" className="hover:text-amber-500 transition-colors font-medium">
            Home
          </Link>
          <Link href="/google-trend-signals" className="hover:text-amber-500 transition-colors">
            Google Trends
          </Link>
          <Link href="/twitter-signals" className="hover:text-amber-500 transition-colors">
            Twitter Signals
          </Link>
          <Link href="/news-signals" className="hover:text-amber-500 transition-colors">
            News Signals
          </Link>
          <Link href="/trade-signals" className="hover:text-amber-500 transition-colors">
            Trade Signals
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
