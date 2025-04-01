import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 bg-gray-800 text-white flex space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/trade-signals" className="hover:underline">Trade Signals</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
