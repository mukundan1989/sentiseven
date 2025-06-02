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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

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
              <nav className="border-b border-border bg-white dark:bg-card">
                <div className="max-w-[1200px] mx-auto px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {/* SENTIBOARD Logo */}
                      <div className="border-2 border-black px-3 py-1 bg-white">
                        <span className="text-black font-bold italic transform -skew-x-12 inline-block text-lg">
                          SENTIBOARD
                        </span>
                      </div>

                      <Link href="/" className="text-foreground hover:text-primary transition-colors whitespace-nowrap">
                        Home
                      </Link>

                      {/* Signals Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors whitespace-nowrap flex items-center">
                          Signals
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background border-border">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/google-trend-signals"
                              className="text-foreground hover:text-primary transition-colors w-full"
                            >
                              Google Trends
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/twitter-signals"
                              className="text-foreground hover:text-primary transition-colors w-full"
                            >
                              Twitter Signals
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/news-signals"
                              className="text-foreground hover:text-primary transition-colors w-full"
                            >
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
