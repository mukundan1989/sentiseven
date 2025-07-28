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
import { ChevronDown, Menu, Activity } from "lucide-react"
import localFont from "next/font/local"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

// Load Neuropol font locally
const neuropol = localFont({
  src: "../public/fonts/neuropol.otf",
  variable: "--font-neuropol",
})

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
      <body className={`${inter.className} ${neuropol.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <nav className="border-b border-border/30 relative z-50 mx-6 mt-6">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {/* Mobile Menu Dropdown */}
                      <div className="xl:hidden mr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-full text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                            >
                              <Menu className="h-6 w-6" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="glass-morphism border-border/30 w-56 mt-2"
                            align="start"
                            sideOffset={8}
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors w-full font-medium"
                              >
                                Home
                              </Link>
                            </DropdownMenuItem>
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
                            <DropdownMenuItem asChild>
                              <Link
                                href="/performance"
                                className="text-foreground hover:text-primary transition-colors w-full font-medium"
                              >
                                Performance
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* SENTIBOARD Logo - responsive */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        {/* Hide text on mobile, show on larger screens */}
                        <span className="hidden sm:block font-neuropol text-foreground text-xl font-bold text-gradient">
                          SENTIBOARD
                        </span>
                      </div>
                    </div>

                    <div className="hidden xl:flex items-center space-x-8">
                      {/* Navigation menu items */}
                      <Link
                        href="/"
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap font-medium px-3 py-2 rounded-lg hover:bg-accent/50"
                      >
                        Home
                      </Link>

                      {/* Signals Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors whitespace-nowrap flex items-center font-medium px-3 py-2 rounded-lg hover:bg-accent/50">
                          Signals
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-morphism border-border/30 shadow-premium">
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
                        className="text-foreground hover:text-primary transition-colors whitespace-nowrap font-medium px-3 py-2 rounded-lg hover:bg-accent/50"
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
