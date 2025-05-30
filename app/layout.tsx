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
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
                    <div className="flex space-x-6 items-center overflow-x-auto">
                      {/* SENTIBOARD Logo */}
                      <div className="border-2 border-black dark:border-white px-2 py-1 mr-2">
                        <span className="font-bold italic tracking-tight text-lg transform -skew-x-12 inline-block">
                          SENTIBOARD
                        </span>
                      </div>

                      <Link href="/" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                        Home
                      </Link>

                      {/* Signals Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary transition-colors whitespace-nowrap">
                          Signals <ChevronDown className="ml-1 h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link href="/google-trend-signals" className="w-full cursor-pointer">
                              Google Trends
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/twitter-signals" className="w-full cursor-pointer">
                              Twitter Signals
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/news-signals" className="w-full cursor-pointer">
                              News Signals
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Link
                        href="/performance"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Performance
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
