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
      <body className="bg-[#0a0b14] text-white min-h-screen">
        <nav className="bg-[#0a0b14] border-b border-gray-800 px-6 py-4">
          <div className="max-w-[1200px] mx-auto flex space-x-6">
            <Link href="/" className="text-white hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link href="/google-trend-signals" className="text-white hover:text-amber-400 transition-colors">
              Google Trends
            </Link>
            <Link href="/twitter-signals" className="text-white hover:text-amber-400 transition-colors">
              Twitter Signals
            </Link>
            <Link href="/news-signals" className="text-white hover:text-amber-400 transition-colors">
              News Signals
            </Link>
            <Link href="/trade-signals" className="text-white hover:text-amber-400 transition-colors">
              Trade Signals
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
